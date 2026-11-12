package com.vit.wt.cricket.dto;

public class BallRecordRequest {
    private int runs;
    private boolean wicket;
    private String wicketType; // "bowled", "caught", "lbw", "run_out"
    private boolean extra;
    private String extraType; // "wide", "no_ball", "bye"
    private String commentary;

    public BallRecordRequest() {}

    public BallRecordRequest(int runs, boolean wicket, String wicketType, boolean extra, String extraType, String commentary) {
        this.runs = runs;
        this.wicket = wicket;
        this.wicketType = wicketType;
        this.extra = extra;
        this.extraType = extraType;
        this.commentary = commentary;
    }

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
}
