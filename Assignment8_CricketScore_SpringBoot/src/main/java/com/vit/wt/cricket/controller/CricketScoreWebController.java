package com.vit.wt.cricket.controller;

import com.vit.wt.cricket.model.CricketMatch;
import com.vit.wt.cricket.service.CricketScoreService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class CricketScoreWebController {

    private final CricketScoreService scoreService;

    public CricketScoreWebController(CricketScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping("/")
    public String rootRedirect() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String showDashboard(@RequestParam(value = "matchId", required = false) String matchId, Model model) {
        List<CricketMatch> matches = scoreService.getAllMatches();
        model.addAttribute("matches", matches);

        String activeId = (matchId != null && !matchId.isBlank()) ? matchId : "match-101";
        CricketMatch activeMatch = scoreService.getMatchById(activeId);
        if (activeMatch == null && !matches.isEmpty()) {
            activeMatch = matches.get(0);
        }

        model.addAttribute("activeMatch", activeMatch);
        return "dashboard";
    }

    @GetMapping("/matches/{id}")
    public String showMatchView(@PathVariable String id) {
        return "redirect:/dashboard?matchId=" + id;
    }
}
