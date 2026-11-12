package com.vit.wt;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.vit.wt.model.StudentResult;
import com.vit.wt.service.ResultService;

@SpringBootApplication
public class SemesterResultApplication {

    public static void main(String[] args) {
        SpringApplication.run(SemesterResultApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDemoData(ResultService service) {
        return args -> {
            // Seed Student 1
            StudentResult s1 = new StudentResult();
            s1.setPrn("12210892");
            s1.setStudentName("Shivam Bhadane");
            s1.setBranch("Computer Engineering");
            s1.setSemester("Semester IV");
            s1.setDivision("A");
            s1.setSub1Mse(88); s1.setSub1Ese(92); // Web Tech
            s1.setSub2Mse(82); s1.setSub2Ese(86); // OS
            s1.setSub3Mse(78); s1.setSub3Ese(84); // CN
            s1.setSub4Mse(85); s1.setSub4Ese(90); // DBMS
            service.calculateAndSave(s1);

            // Seed Student 2
            StudentResult s2 = new StudentResult();
            s2.setPrn("12210451");
            s2.setStudentName("Aarav Sharma");
            s2.setBranch("Computer Engineering");
            s2.setSemester("Semester IV");
            s2.setDivision("B");
            s2.setSub1Mse(72); s2.setSub1Ese(75);
            s2.setSub2Mse(68); s2.setSub2Ese(70);
            s2.setSub3Mse(60); s2.setSub3Ese(65);
            s2.setSub4Mse(74); s2.setSub4Ese(80);
            service.calculateAndSave(s2);
        };
    }
}
