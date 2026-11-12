package com.vit.wt.cricket.service;

import com.vit.wt.cricket.dto.BallRecordRequest;
import com.vit.wt.cricket.dto.MatchCreateRequest;
import com.vit.wt.cricket.model.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CricketScoreService {

    private final Map<String, CricketMatch> matchStore = new ConcurrentHashMap<>();

    public CricketScoreService() {
        initSampleData();
    }

    public List<CricketMatch> getAllMatches() {
        return new ArrayList<>(matchStore.values());
    }

    public CricketMatch getMatchById(String id) {
        return matchStore.get(id);
    }

    public CricketMatch createMatch(MatchCreateRequest req) {
        String id = "match-" + (matchStore.size() + 101);
        CricketMatch match = new CricketMatch();
        match.setId(id);
        match.setTitle(req.getTitle());
        match.setMatchType(req.getMatchType());
        match.setVenue(req.getVenue());
        match.setTeam1(req.getTeam1());
        match.setTeam2(req.getTeam2());
        match.setBattingTeam(req.getTeam1());
        match.setBowlingTeam(req.getTeam2());
        match.setTotalOvers(req.getTotalOvers());
        match.setStatus(MatchStatus.LIVE);

        // Default opening batsmen
        match.getBatsmen().add(new BatsmanStats("Opener One", 0, 0, 0, 0, false, "not out", true));
        match.getBatsmen().add(new BatsmanStats("Opener Two", 0, 0, 0, 0, false, "not out", false));
        match.getBowlers().add(new BowlerStats("Opening Bowler", 0, 0, 0, 0));

        matchStore.put(id, match);
        return match;
    }

    public synchronized CricketMatch recordBall(String matchId, BallRecordRequest req) {
        CricketMatch match = matchStore.get(matchId);
        if (match == null || match.getStatus() == MatchStatus.COMPLETED) {
            return match;
        }

        BatsmanStats striker = match.getStriker();
        BowlerStats bowler = match.getActiveBowler();

        boolean isLegal = !req.isExtra() || "bye".equalsIgnoreCase(req.getExtraType()) || "leg_bye".equalsIgnoreCase(req.getExtraType());

        // Update score
        match.setRuns(match.getRuns() + req.getRuns());

        if (isLegal) {
            match.setCompletedBalls(match.getCompletedBalls() + 1);
            if (bowler != null) {
                bowler.setLegalBalls(bowler.getLegalBalls() + 1);
            }
        }

        // Batsman statistics
        if (striker != null) {
            if (isLegal) {
                striker.setBallsFaced(striker.getBallsFaced() + 1);
            }
            if (!req.isExtra()) {
                striker.setRuns(striker.getRuns() + req.getRuns());
                if (req.getRuns() == 4) striker.setFours(striker.getFours() + 1);
                if (req.getRuns() == 6) striker.setSixes(striker.getSixes() + 1);
            }
        }

        // Bowler statistics
        if (bowler != null) {
            bowler.setRunsConceded(bowler.getRunsConceded() + req.getRuns());
        }

        // Wicket handling
        if (req.isWicket()) {
            match.setWickets(match.getWickets() + 1);
            if (bowler != null) bowler.setWickets(bowler.getWickets() + 1);
            if (striker != null) {
                striker.setOut(true);
                striker.setOnStrike(false);
                striker.setDismissalInfo(req.getWicketType() != null ? req.getWicketType() : "c & b " + (bowler != null ? bowler.getName() : "bowler"));
            }

            // Bring in new batsman if not all out
            if (match.getWickets() < 10) {
                String newBatsmanName = "Batsman #" + (match.getWickets() + 2);
                BatsmanStats newBatsman = new BatsmanStats(newBatsmanName, 0, 0, 0, 0, false, "not out", true);
                match.getBatsmen().add(newBatsman);
            } else {
                match.setStatus(MatchStatus.COMPLETED);
                match.setResultSummary("All Out for " + match.getRuns() + " runs");
            }
        }

        // Strike rotation for odd runs (1, 3)
        if (req.getRuns() % 2 == 1 && !req.isWicket()) {
            switchStrike(match);
        }

        // Recent balls feed
        String ballTag;
        if (req.isWicket()) ballTag = "W";
        else if (req.getRuns() == 0) ballTag = "•";
        else ballTag = String.valueOf(req.getRuns());

        match.getRecentBalls().add(ballTag);
        if (match.getRecentBalls().size() > 8) {
            match.getRecentBalls().remove(0);
        }

        // Over completion check
        int currentOver = (match.getCompletedBalls() - 1) / 6;
        int ballInOver = ((match.getCompletedBalls() - 1) % 6) + 1;

        if (isLegal && match.getCompletedBalls() % 6 == 0) {
            // End of over: switch strike
            switchStrike(match);
        }

        // Commentary entry
        String comm = req.getCommentary();
        if (comm == null || comm.isBlank()) {
            comm = generateCommentary(striker != null ? striker.getName() : "Batsman",
                    bowler != null ? bowler.getName() : "Bowler", req.getRuns(), req.isWicket());
        }

        BallDelivery delivery = new BallDelivery(
                currentOver, ballInOver,
                bowler != null ? bowler.getName() : "Bowler",
                striker != null ? striker.getName() : "Batsman",
                req.getRuns(), req.isWicket(), req.getWicketType(),
                req.isExtra(), req.getExtraType(), comm
        );
        match.getCommentary().add(0, delivery);
        if (match.getCommentary().size() > 20) {
            match.getCommentary().remove(match.getCommentary().size() - 1);
        }

        // Win condition check if 2nd innings
        if (match.getTarget() != null && match.getRuns() >= match.getTarget()) {
            match.setStatus(MatchStatus.COMPLETED);
            match.setResultSummary(match.getBattingTeam() + " won by " + (10 - match.getWickets()) + " wickets!");
        } else if (match.getCompletedBalls() >= match.getTotalOvers() * 6) {
            match.setStatus(MatchStatus.COMPLETED);
            if (match.getTarget() != null) {
                if (match.getRuns() < match.getTarget() - 1) {
                    match.setResultSummary(match.getBowlingTeam() + " won by " + (match.getTarget() - 1 - match.getRuns()) + " runs!");
                } else {
                    match.setResultSummary("Match Tied! Super Over Pending.");
                }
            } else {
                match.setResultSummary("Innings complete: " + match.getRuns() + "/" + match.getWickets());
            }
        }

        return match;
    }

    public CricketMatch simulateNextBall(String matchId) {
        CricketMatch match = matchStore.get(matchId);
        if (match == null || match.getStatus() == MatchStatus.COMPLETED) {
            return match;
        }

        int rand = ThreadLocalRandom.current().nextInt(100);
        BallRecordRequest req = new BallRecordRequest();

        if (rand < 35) {
            // Dot ball
            req.setRuns(0);
            req.setWicket(false);
        } else if (rand < 70) {
            // Single
            req.setRuns(1);
            req.setWicket(false);
        } else if (rand < 80) {
            // Two runs
            req.setRuns(2);
            req.setWicket(false);
        } else if (rand < 90) {
            // Four
            req.setRuns(4);
            req.setWicket(false);
        } else if (rand < 95) {
            // Six
            req.setRuns(6);
            req.setWicket(false);
        } else {
            // Wicket
            req.setRuns(0);
            req.setWicket(true);
            String[] dismissals = {"bowled", "caught at mid-off", "caught behind", "lbw"};
            req.setWicketType(dismissals[ThreadLocalRandom.current().nextInt(dismissals.length)]);
        }

        return recordBall(matchId, req);
    }

    public void resetMatch(String matchId) {
        initSampleData();
    }

    private void switchStrike(CricketMatch match) {
        BatsmanStats s1 = match.getStriker();
        BatsmanStats s2 = match.getNonStriker();
        if (s1 != null && s2 != null) {
            s1.setOnStrike(false);
            s2.setOnStrike(true);
        }
    }

    private String generateCommentary(String batsman, String bowler, int runs, boolean wicket) {
        if (wicket) {
            return "OUT! Gone! " + bowler + " strikes! " + batsman + " mistimes the shot and has to walk back to the pavilion.";
        }
        return switch (runs) {
            case 0 -> bowler + " bowls a probing line just outside off-stump. " + batsman + " taps it defensively to short cover. No run.";
            case 1 -> bowler + " slides into the pads, " + batsman + " neatly nudges it down to deep square leg for a sensible single.";
            case 2 -> batsman + " finds the gap through extra cover, calls hard for two and makes it back comfortably with a dive.";
            case 4 -> "FOUR! Sublime timing! " + batsman + " leans into a full delivery and drives it crisply past mid-off to the boundary fence!";
            case 6 -> "SIX! Up, up and away! " + batsman + " reads the slower ball and launches it into the top tier over long-on! What a shot!";
            default -> batsman + " scores " + runs + " runs off " + bowler + ".";
        };
    }

    public void initSampleData() {
        // Match 1: IND vs SA
        CricketMatch m1 = new CricketMatch();
        m1.setId("match-101");
        m1.setTitle("ICC Men's T20 World Cup Final: India vs South Africa");
        m1.setMatchType("T20 (20 Overs)");
        m1.setVenue("Kensington Oval, Bridgetown, Barbados");
        m1.setTeam1("India");
        m1.setTeam2("South Africa");
        m1.setBattingTeam("India");
        m1.setBowlingTeam("South Africa");
        m1.setCurrentInnings(1);
        m1.setTotalOvers(20);
        m1.setRuns(158);
        m1.setWickets(3);
        m1.setCompletedBalls(104); // 17.2 overs
        m1.setStatus(MatchStatus.LIVE);

        m1.getBatsmen().add(new BatsmanStats("Rohit Sharma (c)", 9, 5, 2, 0, true, "c Klaasen b Maharaj", false));
        m1.getBatsmen().add(new BatsmanStats("Rishabh Pant (wk)", 0, 2, 0, 0, true, "c de Kock b Maharaj", false));
        m1.getBatsmen().add(new BatsmanStats("Suryakumar Yadav", 3, 4, 0, 0, true, "c Klaasen b Rabada", false));
        m1.getBatsmen().add(new BatsmanStats("Virat Kohli", 70, 53, 5, 2, false, "not out", true));
        m1.getBatsmen().add(new BatsmanStats("Axar Patel", 47, 31, 1, 4, true, "run out (de Kock)", false));
        m1.getBatsmen().add(new BatsmanStats("Shivam Dube", 16, 9, 2, 0, false, "not out", false));

        m1.getBowlers().add(new BowlerStats("Marco Jansen", 18, 0, 31, 0));
        m1.getBowlers().add(new BowlerStats("Keshav Maharaj", 18, 0, 23, 2));
        m1.getBowlers().add(new BowlerStats("Kagiso Rabada", 20, 0, 29, 1));
        m1.getBowlers().add(new BowlerStats("Anrich Nortje", 24, 0, 26, 2));

        m1.getRecentBalls().addAll(List.of("1", "4", "0", "6", "1", "2"));

        m1.getCommentary().add(new BallDelivery(17, 2, "Kagiso Rabada", "Virat Kohli", 2, false, null, false, null,
                "Worked into the vacant pocket at deep midwicket, Kohli sprints for two!"));
        m1.getCommentary().add(new BallDelivery(17, 1, "Kagiso Rabada", "Virat Kohli", 1, false, null, false, null,
                "Back of a length angling in, Kohli guides it down to third man for one."));
        m1.getCommentary().add(new BallDelivery(16, 6, "Marco Jansen", "Virat Kohli", 6, false, null, false, null,
                "SIX! High and handsome over long-on! Kohli steps down and clears the boundary rope effortlessly!"));

        matchStore.put(m1.getId(), m1);

        // Match 2: AUS vs AFG
        CricketMatch m2 = new CricketMatch();
        m2.setId("match-102");
        m2.setTitle("ICC Men's T20 World Cup Super 8s: Afghanistan vs Australia");
        m2.setMatchType("T20 (20 Overs)");
        m2.setVenue("Arnos Vale Ground, Kingstown, St Vincent");
        m2.setTeam1("Afghanistan");
        m2.setTeam2("Australia");
        m2.setBattingTeam("Australia");
        m2.setBowlingTeam("Afghanistan");
        m2.setCurrentInnings(2);
        m2.setTotalOvers(20);
        m2.setRuns(127);
        m2.setWickets(10);
        m2.setCompletedBalls(116);
        m2.setTarget(149);
        m2.setStatus(MatchStatus.COMPLETED);
        m2.setResultSummary("Afghanistan won by 21 runs (Historical Victory!)");

        matchStore.put(m2.getId(), m2);

        // Match 3: IND vs ENG
        CricketMatch m3 = new CricketMatch();
        m3.setId("match-103");
        m3.setTitle("ICC Men's T20 World Cup Semi-Final 2: India vs England");
        m3.setMatchType("T20 (20 Overs)");
        m3.setVenue("Providence Stadium, Georgetown, Guyana");
        m3.setTeam1("India");
        m3.setTeam2("England");
        m3.setBattingTeam("India");
        m3.setBowlingTeam("England");
        m3.setCurrentInnings(1);
        m3.setTotalOvers(20);
        m3.setRuns(0);
        m3.setWickets(0);
        m3.setCompletedBalls(0);
        m3.setStatus(MatchStatus.UPCOMING);
        m3.setResultSummary("Match scheduled to commence at 20:00 IST.");

        matchStore.put(m3.getId(), m3);
    }
}
