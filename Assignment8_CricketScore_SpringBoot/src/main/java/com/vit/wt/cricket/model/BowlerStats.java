package com.vit.wt.cricket.model;

public class BowlerStats {
    private String name;
    private int legalBalls;
    private int maidens;
    private int runsConceded;
    private int wickets;

    public BowlerStats() {}

    public BowlerStats(String name, int legalBalls, int maidens, int runsConceded, int wickets) {
        this.name = name;
        this.legalBalls = legalBalls;
        this.maidens = maidens;
        this.runsConceded = runsConceded;
        this.wickets = wickets;
    }

    public String getOversDisplay() {
        int fullOvers = legalBalls / 6;
        int ballsInOver = legalBalls % 6;
        return fullOvers + "." + ballsInOver;
    }

    public double getEconomyRate() {
        if (legalBalls == 0) return 0.0;
        double oversFraction = (double) legalBalls / 6.0;
        return Math.round((runsConceded / oversFraction) * 100.0) / 100.0;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getLegalBalls() { return legalBalls; }
    public void setLegalBalls(int legalBalls) { this.legalBalls = legalBalls; }

    public int getMaidens() { return maidens; }
    public void setMaidens(int maidens) { this.maidens = maidens; }

    public int getRunsConceded() { return runsConceded; }
    public void setRunsConceded(int runsConceded) { this.runsConceded = runsConceded; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }
}
