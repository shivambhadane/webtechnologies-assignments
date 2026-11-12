package com.vit.wt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vit.wt.model.StudentResult;
import com.vit.wt.service.ResultService;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultRestController {

    private final ResultService resultService;

    public ResultRestController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public List<StudentResult> getAll() {
        return resultService.getAllResults();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResult> getById(@PathVariable Long id) {
        return resultService.getResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/prn/{prn}")
    public ResponseEntity<StudentResult> getByPrn(@PathVariable String prn) {
        return resultService.getResultByPrn(prn)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentResult> create(@RequestBody StudentResult student) {
        StudentResult saved = resultService.calculateAndSave(student);
        return ResponseEntity.ok(saved);
    }
}
