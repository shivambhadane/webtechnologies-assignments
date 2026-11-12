package com.vit.wt.cricket.controller;

import com.vit.wt.cricket.dto.BallRecordRequest;
import com.vit.wt.cricket.dto.MatchCreateRequest;
import com.vit.wt.cricket.model.CricketMatch;
import com.vit.wt.cricket.service.CricketScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class CricketScoreRestController {

    private final CricketScoreService scoreService;

    public CricketScoreRestController(CricketScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping
    public ResponseEntity<List<CricketMatch>> getAllMatches() {
        return ResponseEntity.ok(scoreService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CricketMatch> getMatchById(@PathVariable String id) {
        CricketMatch match = scoreService.getMatchById(id);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(match);
    }

    @PostMapping
    public ResponseEntity<CricketMatch> createMatch(@RequestBody MatchCreateRequest request) {
        CricketMatch created = scoreService.createMatch(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/ball")
    public ResponseEntity<CricketMatch> recordBall(@PathVariable String id, @RequestBody BallRecordRequest request) {
        CricketMatch updated = scoreService.recordBall(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/simulate")
    public ResponseEntity<CricketMatch> simulateBall(@PathVariable String id) {
        CricketMatch updated = scoreService.simulateNextBall(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<Map<String, String>> resetMatch(@PathVariable String id) {
        scoreService.resetMatch(id);
        return ResponseEntity.ok(Map.of("message", "Match " + id + " reset to initial state successfully"));
    }
}
