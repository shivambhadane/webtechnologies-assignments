package com.vit.wt.controller;

import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.vit.wt.model.StudentResult;
import com.vit.wt.service.ResultService;

@Controller
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("results", resultService.getAllResults());
        model.addAttribute("student", new StudentResult());
        return "index";
    }

    @PostMapping("/calculate")
    public String calculateResult(@ModelAttribute StudentResult student, Model model) {
        StudentResult saved = resultService.calculateAndSave(student);
        return "redirect:/result/" + saved.getId();
    }

    @GetMapping("/result/{id}")
    public String viewGradeCard(@PathVariable Long id, Model model) {
        Optional<StudentResult> res = resultService.getResultById(id);
        if (res.isPresent()) {
            model.addAttribute("res", res.get());
            return "grade_card";
        }
        return "redirect:/";
    }

    @GetMapping("/records")
    public String viewAllRecords(Model model) {
        model.addAttribute("results", resultService.getAllResults());
        return "records";
    }
}
