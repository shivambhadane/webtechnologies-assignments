# Technical Documentation: Real-Time Cricket Score Management System

**Course:** CS3111 - Web Technology  
**Assignment:** Practical No. 8  
**Author:** Shivam Bhadane  
**Faculty Evaluator:** Dr. Yashwant V. Dongre  

---

## 1. System Overview & Problem Statement

The goal of this assignment is to develop an enterprise-ready, scalable, real-time cricket score management web platform using Spring Boot. Live scoring platforms must handle rapid read/write operations without locking the UI, compute derived metrics on the fly (Current Run Rate, Required Run Rate, Batsman Strike Rate, Bowler Economy), rotate strikes correctly upon singles or over completions, and distribute updates through REST endpoints.

```
+-------------------------------------------------------------------------+
|                           Client Browser                                |
|  - HTML5 / Bootstrap 5.3 Broadcast Scoreboard                           |
|  - Asynchronous Fetch API for Zero-Reload Updates                       |
+------------------------------------|------------------------------------+
                                     | HTTP REST (JSON)
+------------------------------------v------------------------------------+
|               Spring Boot REST Controller (Port 8083)                   |
|                  /api/matches, /api/matches/{id}/simulate               |
+------------------------------------|------------------------------------+
                                     |
+------------------------------------v------------------------------------+
|              CricketScoreService (Concurrent Business Logic)            |
|  - Strike Rotation Engine (Odd runs & End of Over)                      |
|  - Probabilistic Delivery Simulation (Dots, 1s, 2s, 4s, 6s, Wickets)   |
|  - Derived Metrics (CRR, RRR, SR, ECON)                                 |
+------------------------------------|------------------------------------+
                                     |
+------------------------------------v------------------------------------+
|         In-Memory Match State Store (ConcurrentHashMap)                |
|  - High throughput, thread-safe cricket match state machine             |
+-------------------------------------------------------------------------+
```

---

## 2. Core Cricket Scoring Algorithms

### 2.1 Strike Rotation
Strike rotation occurs in two scenarios:
1. **Odd Runs on Delivery:** When runs scored on a ball are 1 or 3, striker and non-striker positions are swapped.
2. **End of Over:** When `completedBalls % 6 == 0`, strike rotates between the two batters on the crease.

### 2.2 Mathematical Formulas
- **Overs Display:**
  $$\text{Full Overs} = \lfloor \frac{\text{balls}}{6} \rfloor, \quad \text{Balls in Over} = \text{balls} \pmod 6$$
- **Current Run Rate (CRR):**
  $$\text{CRR} = \frac{\text{Total Runs}}{\text{Completed Balls} / 6.0}$$
- **Required Run Rate (RRR):**
  $$\text{RRR} = \frac{\text{Target} - \text{Current Runs}}{(\text{Total Balls} - \text{Completed Balls}) / 6.0}$$
- **Batsman Strike Rate:**
  $$\text{SR} = \frac{\text{Runs}}{\text{Balls Faced}} \times 100$$
- **Bowler Economy Rate:**
  $$\text{ECON} = \frac{\text{Runs Conceded}}{\text{Legal Balls Bowled} / 6.0}$$

---

## 3. REST API Specifications

### 3.1 Fetch Match by ID
- **Endpoint:** `GET /api/matches/{id}`
- **Sample Response:**
```json
{
  "id": "match-101",
  "title": "ICC Men's T20 World Cup Final: India vs South Africa",
  "matchType": "T20 (20 Overs)",
  "venue": "Kensington Oval, Bridgetown, Barbados",
  "runs": 158,
  "wickets": 3,
  "completedBalls": 104,
  "oversDisplay": "17.2",
  "currentRunRate": 9.12,
  "status": "LIVE",
  "batsmen": [
    {
      "name": "Virat Kohli",
      "runs": 70,
      "ballsFaced": 53,
      "fours": 5,
      "sixes": 2,
      "strikeRate": 132.08,
      "onStrike": true
    }
  ],
  "bowlers": [
    {
      "name": "Kagiso Rabada",
      "oversDisplay": "3.2",
      "maidens": 0,
      "runsConceded": 29,
      "wickets": 1,
      "economyRate": 8.7
    }
  ],
  "recentBalls": ["1", "4", "•", "6", "1", "2"]
}
```

### 3.2 Simulate Next Ball
- **Endpoint:** `POST /api/matches/{id}/simulate`
- **Behavior:** Executes a weighted probabilistic simulation representing real-world T20 delivery distributions:
  - 35% Dot balls
  - 35% Singles
  - 10% Twos
  - 10% Fours
  - 5% Sixes
  - 5% Wickets
- Appends authentic commentary and updates batsman/bowler cards.

---

## 4. Verification & Testing

| Test Case | Description | Expected Output | Status |
|-----------|-------------|-----------------|--------|
| TC-01 | Maven Build | `mvn clean compile` succeeds | PASS |
| TC-02 | REST API Get All | Returns list of 3 matches | PASS |
| TC-03 | Live Ball Simulation | POST `/api/matches/match-101/simulate` updates score & strike | PASS |
| TC-04 | End of Over Logic | At 6th ball of an over, strike automatically switches | PASS |
| TC-05 | Wicket Dismissal | Increments wicket count and introduces next batsman | PASS |
| TC-06 | Dashboard DOM Sync | Client JS updates scoreboard without page reload | PASS |
