package com.vit.wt.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vit.wt.model.StudentResult;
import com.vit.wt.repository.StudentResultRepository;

@Service
public class ResultService {

    private final StudentResultRepository repository;

    public ResultService(StudentResultRepository repository) {
        this.repository = repository;
    }

    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    public Optional<StudentResult> getResultById(Long id) {
        return repository.findById(id);
    }

    public Optional<StudentResult> getResultByPrn(String prn) {
        return repository.findByPrn(prn);
    }

    public StudentResult calculateAndSave(StudentResult student) {
        // Calculate Subject 1
        student.setSub1Total(round((student.getSub1Mse() * 0.30) + (student.getSub1Ese() * 0.70)));
        student.setSub1Grade(computeGrade(student.getSub1Total()));
        student.setSub1GradePoints(computeGradePoints(student.getSub1Total()));

        // Calculate Subject 2
        student.setSub2Total(round((student.getSub2Mse() * 0.30) + (student.getSub2Ese() * 0.70)));
        student.setSub2Grade(computeGrade(student.getSub2Total()));
        student.setSub2GradePoints(computeGradePoints(student.getSub2Total()));

        // Calculate Subject 3
        student.setSub3Total(round((student.getSub3Mse() * 0.30) + (student.getSub3Ese() * 0.70)));
        student.setSub3Grade(computeGrade(student.getSub3Total()));
        student.setSub3GradePoints(computeGradePoints(student.getSub3Total()));

        // Calculate Subject 4
        student.setSub4Total(round((student.getSub4Mse() * 0.30) + (student.getSub4Ese() * 0.70)));
        student.setSub4Grade(computeGrade(student.getSub4Total()));
        student.setSub4GradePoints(computeGradePoints(student.getSub4Total()));

        // Grand Total & Percentage
        double grand = student.getSub1Total() + student.getSub2Total() + student.getSub3Total() + student.getSub4Total();
        student.setGrandTotal(round(grand));
        student.setPercentage(round((grand / 400.0) * 100.0));

        // SGPA calculation across all 4 subjects
        double totalPoints = student.getSub1GradePoints() + student.getSub2GradePoints() 
                           + student.getSub3GradePoints() + student.getSub4GradePoints();
        student.setSgpa(round(totalPoints / 4.0));

        // Pass/Fail status
        if ("F".equals(student.getSub1Grade()) || "F".equals(student.getSub2Grade())
                || "F".equals(student.getSub3Grade()) || "F".equals(student.getSub4Grade())) {
            student.setOverallStatus("FAIL");
        } else {
            student.setOverallStatus("PASS");
        }

        return repository.save(student);
    }

    public static String computeGrade(double marks) {
        if (marks >= 90.0) return "O";
        if (marks >= 80.0) return "A+";
        if (marks >= 70.0) return "A";
        if (marks >= 60.0) return "B+";
        if (marks >= 55.0) return "B";
        if (marks >= 40.0) return "C";
        return "F";
    }

    public static int computeGradePoints(double marks) {
        if (marks >= 90.0) return 10;
        if (marks >= 80.0) return 9;
        if (marks >= 70.0) return 8;
        if (marks >= 60.0) return 7;
        if (marks >= 55.0) return 6;
        if (marks >= 40.0) return 5;
        return 0;
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
