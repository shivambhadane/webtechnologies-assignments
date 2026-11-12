# Assignment 8: Scalable Real-Time Cricket Score Management System

**Course:** CS3111 - Web Technology  
**Faculty In-Charge:** Dr. Yashwant V. Dongre  
**Institution:** Vishwakarma Institute of Technology, Pune  

---

## 🎯 Aim & Objectives
To develop a scalable and real-time **Cricket Score Management System** using **Spring Boot 3** and **Java 21** that:
1. Fetches, processes, and displays live cricket match information through **REST APIs**.
2. Renders a responsive, interactive frontend dashboard simulating a live sports broadcast platform.
3. Efficiently handles ongoing matches, score updates, player statistics (strike rates, economy rates), and ball-by-ball commentary.
4. Provides real-time dynamic DOM updates via client-side fetch without full-page reloads.

---

## 🛠️ Technology Stack
- **Backend Framework:** Spring Boot 3.2.5 (Spring Web, Spring MVC)
- **Language:** Java 21 (OpenJDK 21)
- **Template Engine:** Thymeleaf 3.1
- **Styling:** Bootstrap 5.3 + Bootstrap Icons
- **Architecture:** Controller-Service-Repository Pattern, RESTful JSON Endpoints, Concurrent In-Memory State Machine
- **Build Tool:** Apache Maven 3.9+

---

## 🚀 Quick Start & Execution

### Prerequisites
- JDK 21 installed (`java -version`)
- Maven 3.8+ installed (`mvn -version`)

### Compilation & Running
```bash
# 1. Navigate to Assignment 8 directory
cd Assignment8_CricketScore_SpringBoot

# 2. Compile the project
mvn clean compile

# 3. Start the Spring Boot application on Port 8083
mvn spring-boot:run
```

Once running:
- **Interactive UI Dashboard:** Open [http://localhost:8083/dashboard](http://localhost:8083/dashboard)
- **REST API Endpoints:** Open [http://localhost:8083/api/matches](http://localhost:8083/api/matches)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Payload / Params |
|---|---|---|---|
| `GET` | `/api/matches` | Returns all matches (Live, Upcoming, Completed) | None |
| `GET` | `/api/matches/{id}` | Returns comprehensive match details and commentary | Match ID (`match-101`) |
| `POST` | `/api/matches` | Creates a new cricket match fixture | `{"title":"...", "team1":"IND", "team2":"AUS"}` |
| `POST` | `/api/matches/{id}/ball` | Records a custom ball delivery score | `{"runs": 4, "wicket": false, "commentary": "Four!"}` |
| `POST` | `/api/matches/{id}/simulate` | Simulates realistic weighted random ball | None |
| `POST` | `/api/matches/{id}/reset` | Resets match state to initial demo over | None |

---

## 📂 Project Structure
```
Assignment8_CricketScore_SpringBoot/
├── pom.xml
├── README.md
├── DOCUMENTATION.md
└── src/
    └── main/
        ├── java/com/vit/wt/cricket/
        │   ├── CricketScoreApplication.java
        │   ├── controller/
        │   │   ├── CricketScoreRestController.java
        │   │   └── CricketScoreWebController.java
        │   ├── dto/
        │   │   ├── BallRecordRequest.java
        │   │   └── MatchCreateRequest.java
        │   ├── model/
        │   │   ├── BallDelivery.java
        │   │   ├── BatsmanStats.java
        │   │   ├── BowlerStats.java
        │   │   ├── CricketMatch.java
        │   │   └── MatchStatus.java
        │   └── service/
        │       └── CricketScoreService.java
        └── resources/
            ├── application.properties
            └── templates/
                └── dashboard.html
```
