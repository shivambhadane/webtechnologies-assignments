package com.vit.wt.cricket.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BallDelivery {
    private int over;
    private int ballInOver;
    private String bowler;
    private String batsman;
    private int runs;
    private boolean wicket;
    private String wicketType;
    private boolean extra;
    private String extraType;
    private String commentary;
    private String timestamp;

    public BallDelivery() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public BallDelivery(int over, int ballInOver, String bowler, String batsman, int runs,
                        boolean wicket, String wicketType, boolean extra, String extraType,
                        String commentary) {
        this.over = over;
        this.ballInOver = ballInOver;
        this.bowler = bowler;
        this.batsman = batsman;
        this.runs = runs;
        this.wicket = wicket;
        this.wicketType = wicketType;
        this.extra = extra;
        this.extraType = extraType;
        this.commentary = commentary;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public String getBallTag() {
        if (wicket) return "W";
        if (runs == 4) return "4";
        if (runs == 6) return "6";
        if (runs == 0) return "•";
        return String.valueOf(runs);
    }

    public int getOver() { return over; }
    public void setOver(int over) { this.over = over; }

    public int getBallInOver() { return ballInOver; }
    public void setBallInOver(int ballInOver) { this.ballInOver = ballInOver; }

    public String getBowler() { return bowler; }
    public void setBowler(String bowler) { this.bowler = bowler; }

    public String getBatsman() { return batsman; }
    public void setBatsman(String batsman) { this.batsman = batsman; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public boolean isWicket() { return wicket; }
    public void setWicket(boolean wicket) { this.wicket = wicket; }

    public String getWicketType() { return wicketType; }
    public void setWicketType(String wicketType) { this.wicketType = wicketType; }

    public boolean isExtra() { return extra; }
    public void setExtra(boolean extra) { this.extra = extra; }

    public String getExtraType() { return extraType; }
    public void setExtraType(String extraType) { this.extraType = extraType; }

    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
