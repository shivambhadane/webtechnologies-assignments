package com.vit.wt.cricket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CricketScoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricketScoreApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🏏 Cricket Score Management System (Spring Boot)");
        System.out.println("🌐 Dashboard UI: http://localhost:8083/dashboard");
        System.out.println("⚡ REST API:     http://localhost:8083/api/matches");
        System.out.println("==========================================================");
    }
}
