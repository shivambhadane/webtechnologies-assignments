package com.vit.wt.cricket.dto;

public class MatchCreateRequest {
    private String title;
    private String matchType = "T20";
    private String venue;
    private String team1;
    private String team2;
    private int totalOvers = 20;

    public MatchCreateRequest() {}

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

    public int getTotalOvers() { return totalOvers; }
    public void setTotalOvers(int totalOvers) { this.totalOvers = totalOvers; }
}
