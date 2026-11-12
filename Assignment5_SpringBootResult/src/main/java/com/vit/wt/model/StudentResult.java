package com.vit.wt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_results")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String prn;
    private String studentName;
    private String branch = "Computer Engineering";
    private String semester = "Semester IV";
    private String division = "A";

    // 4 Subjects: MSE (30%) and ESE (70%) marks
    // Subject 1: Web Technologies (CS3111)
    private double sub1Mse;
    private double sub1Ese;
    private double sub1Total;
    private String sub1Grade;
    private int sub1GradePoints;

    // Subject 2: Operating Systems (CS3112)
    private double sub2Mse;
    private double sub2Ese;
    private double sub2Total;
    private String sub2Grade;
    private int sub2GradePoints;

    // Subject 3: Computer Networks (CS3113)
    private double sub3Mse;
    private double sub3Ese;
    private double sub3Total;
    private String sub3Grade;
    private int sub3GradePoints;

    // Subject 4: Database Management Systems (CS3114)
    private double sub4Mse;
    private double sub4Ese;
    private double sub4Total;
    private String sub4Grade;
    private int sub4GradePoints;

    // Overall Aggregate
    private double grandTotal; // out of 400
    private double percentage;
    private double sgpa;
    private String overallStatus; // "PASS" or "FAIL"

    public StudentResult() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrn() { return prn; }
    public void setPrn(String prn) { this.prn = prn; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }

    public double getSub1Mse() { return sub1Mse; }
    public void setSub1Mse(double sub1Mse) { this.sub1Mse = sub1Mse; }
    public double getSub1Ese() { return sub1Ese; }
    public void setSub1Ese(double sub1Ese) { this.sub1Ese = sub1Ese; }
    public double getSub1Total() { return sub1Total; }
    public void setSub1Total(double sub1Total) { this.sub1Total = sub1Total; }
    public String getSub1Grade() { return sub1Grade; }
    public void setSub1Grade(String sub1Grade) { this.sub1Grade = sub1Grade; }
    public int getSub1GradePoints() { return sub1GradePoints; }
    public void setSub1GradePoints(int sub1GradePoints) { this.sub1GradePoints = sub1GradePoints; }

    public double getSub2Mse() { return sub2Mse; }
    public void setSub2Mse(double sub2Mse) { this.sub2Mse = sub2Mse; }
    public double getSub2Ese() { return sub2Ese; }
    public void setSub2Ese(double sub2Ese) { this.sub2Ese = sub2Ese; }
    public double getSub2Total() { return sub2Total; }
    public void setSub2Total(double sub2Total) { this.sub2Total = sub2Total; }
    public String getSub2Grade() { return sub2Grade; }
    public void setSub2Grade(String sub2Grade) { this.sub2Grade = sub2Grade; }
    public int getSub2GradePoints() { return sub2GradePoints; }
    public void setSub2GradePoints(int sub2GradePoints) { this.sub2GradePoints = sub2GradePoints; }

    public double getSub3Mse() { return sub3Mse; }
    public void setSub3Mse(double sub3Mse) { this.sub3Mse = sub3Mse; }
    public double getSub3Ese() { return sub3Ese; }
    public void setSub3Ese(double sub3Ese) { this.sub3Ese = sub3Ese; }
    public double getSub3Total() { return sub3Total; }
    public void setSub3Total(double sub3Total) { this.sub3Total = sub3Total; }
    public String getSub3Grade() { return sub3Grade; }
    public void setSub3Grade(String sub3Grade) { this.sub3Grade = sub3Grade; }
    public int getSub3GradePoints() { return sub3GradePoints; }
    public void setSub3GradePoints(int sub3GradePoints) { this.sub3GradePoints = sub3GradePoints; }

    public double getSub4Mse() { return sub4Mse; }
    public void setSub4Mse(double sub4Mse) { this.sub4Mse = sub4Mse; }
    public double getSub4Ese() { return sub4Ese; }
    public void setSub4Ese(double sub4Ese) { this.sub4Ese = sub4Ese; }
    public double getSub4Total() { return sub4Total; }
    public void setSub4Total(double sub4Total) { this.sub4Total = sub4Total; }
    public String getSub4Grade() { return sub4Grade; }
    public void setSub4Grade(String sub4Grade) { this.sub4Grade = sub4Grade; }
    public int getSub4GradePoints() { return sub4GradePoints; }
    public void setSub4GradePoints(int sub4GradePoints) { this.sub4GradePoints = sub4GradePoints; }

    public double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public double getSgpa() { return sgpa; }
    public void setSgpa(double sgpa) { this.sgpa = sgpa; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }
}
