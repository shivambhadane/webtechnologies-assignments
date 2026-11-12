package com.vit.wt.cricket.model;

import java.util.ArrayList;
import java.util.List;

public class CricketMatch {
    private String id;
    private String title;
    private String matchType;
    private String venue;
    private String team1;
    private String team2;
    private String battingTeam;
    private String bowlingTeam;
    private int currentInnings;
    private int totalOvers;
    private int runs;
    private int wickets;
    private int completedBalls;
    private Integer target;
    private MatchStatus status;
    private String resultSummary;

    private List<BatsmanStats> batsmen = new ArrayList<>();
    private List<BowlerStats> bowlers = new ArrayList<>();
    private List<String> recentBalls = new ArrayList<>();
    private List<BallDelivery> commentary = new ArrayList<>();

    public CricketMatch() {
        this.status = MatchStatus.LIVE;
        this.currentInnings = 1;
        this.totalOvers = 20;
    }

    public String getOversDisplay() {
        int fullOvers = completedBalls / 6;
        int ballsInCurrentOver = completedBalls % 6;
        return fullOvers + "." + ballsInCurrentOver;
    }

    public double getCurrentRunRate() {
        if (completedBalls == 0) return 0.0;
        double oversFraction = (double) completedBalls / 6.0;
        return Math.round((runs / oversFraction) * 100.0) / 100.0;
    }

    public Double getRequiredRunRate() {
        if (target == null || target <= 0) return null;
        int ballsRemaining = (totalOvers * 6) - completedBalls;
        int runsNeeded = target - runs;
        if (ballsRemaining <= 0 || runsNeeded <= 0) return 0.0;
        double oversRemaining = (double) ballsRemaining / 6.0;
        return Math.round((runsNeeded / oversRemaining) * 100.0) / 100.0;
    }

    public BatsmanStats getStriker() {
        return batsmen.stream().filter(b -> !b.isOut() && b.isOnStrike()).findFirst().orElse(null);
    }

    public BatsmanStats getNonStriker() {
        return batsmen.stream().filter(b -> !b.isOut() && !b.isOnStrike()).findFirst().orElse(null);
    }

    public BowlerStats getActiveBowler() {
        if (bowlers.isEmpty()) return null;
        return bowlers.get(bowlers.size() - 1);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getTeam1() { return team1; }
    public void setTeam1(String team1) { this.team1 = team1; }

    public String getTeam2() { return team2; }
    public void setTeam2(String team2) { this.team2 = team2; }

    public String getBattingTeam() { return battingTeam; }
    public void setBattingTeam(String battingTeam) { this.battingTeam = battingTeam; }

    public String getBowlingTeam() { return bowlingTeam; }
    public void setBowlingTeam(String bowlingTeam) { this.bowlingTeam = bowlingTeam; }

    public int getCurrentInnings() { return currentInnings; }
    public void setCurrentInnings(int currentInnings) { this.currentInnings = currentInnings; }

    public int getTotalOvers() { return totalOvers; }
    public void setTotalOvers(int totalOvers) { this.totalOvers = totalOvers; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public int getCompletedBalls() { return completedBalls; }
    public void setCompletedBalls(int completedBalls) { this.completedBalls = completedBalls; }

    public Integer getTarget() { return target; }
    public void setTarget(Integer target) { this.target = target; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public String getResultSummary() { return resultSummary; }
    public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }

    public List<BatsmanStats> getBatsmen() { return batsmen; }
    public void setBatsmen(List<BatsmanStats> batsmen) { this.batsmen = batsmen; }

    public List<BowlerStats> getBowlers() { return bowlers; }
    public void setBowlers(List<BowlerStats> bowlers) { this.bowlers = bowlers; }

    public List<String> getRecentBalls() { return recentBalls; }
    public void setRecentBalls(List<String> recentBalls) { this.recentBalls = recentBalls; }

    public List<BallDelivery> getCommentary() { return commentary; }
    public void setCommentary(List<BallDelivery> commentary) { this.commentary = commentary; }
}
