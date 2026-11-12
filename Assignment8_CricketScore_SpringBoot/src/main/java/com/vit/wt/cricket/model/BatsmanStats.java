package com.vit.wt.cricket.model;

public class BatsmanStats {
    private String name;
    private int runs;
    private int ballsFaced;
    private int fours;
    private int sixes;
    private boolean out;
    private String dismissalInfo;
    private boolean onStrike;

    public BatsmanStats() {}

    public BatsmanStats(String name, int runs, int ballsFaced, int fours, int sixes, boolean out, String dismissalInfo, boolean onStrike) {
        this.name = name;
        this.runs = runs;
        this.ballsFaced = ballsFaced;
        this.fours = fours;
        this.sixes = sixes;
        this.out = out;
        this.dismissalInfo = dismissalInfo;
        this.onStrike = onStrike;
    }

    public double getStrikeRate() {
        if (ballsFaced == 0) return 0.0;
        return Math.round((double) runs / ballsFaced * 10000.0) / 100.0;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getBallsFaced() { return ballsFaced; }
    public void setBallsFaced(int ballsFaced) { this.ballsFaced = ballsFaced; }

    public int getFours() { return fours; }
    public void setFours(int fours) { this.fours = fours; }

    public int getSixes() { return sixes; }
    public void setSixes(int sixes) { this.sixes = sixes; }

    public boolean isOut() { return out; }
    public void setOut(boolean out) { this.out = out; }

    public String getDismissalInfo() { return dismissalInfo; }
    public void setDismissalInfo(String dismissalInfo) { this.dismissalInfo = dismissalInfo; }

    public boolean isOnStrike() { return onStrike; }
    public void setOnStrike(boolean onStrike) { this.onStrike = onStrike; }
}
