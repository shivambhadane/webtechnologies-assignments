# Practical 5: VIT Semester Result Management Web App (Spring Boot & MySQL)

**Course**: CS3111: Web Technologies  
**Institution**: Vishwakarma Institute of Technology (VIT Pune)  
**Academic Year**: 2026–27  
**Tech Stack**: Java 21, Spring Boot 3.2, Spring Data JPA, Hibernate, Thymeleaf, MySQL / H2, Bootstrap 5.3  

---

## 1. Problem Statement & Objective

Design and develop a responsive website to prepare one semester result of VIT students using **Spring Boot and MySQL**. Take any **four subjects** with **MSE Marks (30% weightage)** and **ESE Marks (70% weightage)**.

### Assessment Formula:
$$\text{Subject Final Marks} = (\text{MSE Marks} \times 0.30) + (\text{ESE Marks} \times 0.70)$$

### 4 Core Subjects Evaluated:
1. `CS3111`: Web Technologies
2. `CS3112`: Operating Systems
3. `CS3113`: Computer Networks
4. `CS3114`: Database Management Systems

### Grading Matrix:
* **90 – 100**: Grade `O` (Points: 10)
* **80 – 89**: Grade `A+` (Points: 9)
* **70 – 79**: Grade `A` (Points: 8)
* **60 – 69**: Grade `B+` (Points: 7)
* **55 – 59**: Grade `B` (Points: 6)
* **40 – 54**: Grade `C` (Points: 5)
* **Below 40**: Grade `F` (Points: 0) — *Fail*

$$\text{SGPA} = \frac{\sum (\text{Subject Grade Points})}{4.00}$$

---

## 2. Architecture & Design

```
   ┌────────────────────────────────────────────────────────┐
   │                  Browser Client                        │
   │      Thymeleaf UI / Bootstrap 5 / REST Consumer        │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
    HTTP Form Submission                  JSON REST API
         (GET/POST)                     (/api/results)
               │                                │
               ▼                                ▼
   ┌───────────────────────┐        ┌───────────────────────┐
   │   ResultController    │        │ ResultRestController  │
   │  (Spring MVC Web UI)  │        │   (REST Controller)   │
   └───────────┬───────────┘        └───────────┬───────────┘
               └────────────────┬───────────────┘
                                ▼
                   ┌─────────────────────────┐
                   │      ResultService      │
                   │ (MSE 30% + ESE 70% Calc)│
                   └────────────┬────────────┘
                                ▼
                   ┌─────────────────────────┐
                   │ StudentResultRepository │
                   │    (Spring Data JPA)    │
                   └────────────┬────────────┘
                                ▼
                   ┌─────────────────────────┐
                   │ Database (MySQL / H2)   │
                   └─────────────────────────┘
```

---

## 3. Quickstart & Local Execution

### Run Application:
```bash
cd Assignment5_SpringBootResult
mvn spring-boot:run
```

Open your browser at:  
👉 **`http://localhost:8082/`**

* **Web Result Portal**: `http://localhost:8082/`
* **Student Archive**: `http://localhost:8082/records`
* **REST API Endpoint**: `http://localhost:8082/api/results`
* **Embedded Database Console**: `http://localhost:8082/h2-console` (JDBC URL: `jdbc:h2:mem:vitresults`, User: `sa`)

---

## 4. Test Cases Verification

| Student | PRN | Subject 1 (WT) | Subject 2 (OS) | Subject 3 (CN) | Subject 4 (DBMS) | Grand / 400 | SGPA | Status |
|---|---|---|---|---|---|---|---|---|
| **Shivam** | 12210892 | MSE: 88, ESE: 92 → **90.8 (O)** | MSE: 82, ESE: 86 → **84.8 (A+)** | MSE: 78, ESE: 84 → **82.2 (A+)** | MSE: 85, ESE: 90 → **88.5 (O)** | **346.3** | **9.50** | **PASS** |
| **Aarav** | 12210451 | MSE: 72, ESE: 75 → **74.1 (A)** | MSE: 68, ESE: 70 → **69.4 (B+)** | MSE: 60, ESE: 65 → **63.5 (B+)** | MSE: 74, ESE: 80 → **78.2 (A)** | **285.2** | **7.50** | **PASS** |
