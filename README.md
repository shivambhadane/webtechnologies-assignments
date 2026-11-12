# Web Technologies Practicals & Assignments Repository

**Course:** CS3111 - Web Technology  
**Program:** B.Tech Computer Engineering (Semester 4)  
**Institution:** Vishwakarma Institute of Technology (VIT), Pune  
**Faculty In-Charge:** Prof. Dr. Yashwant V. Dongre  
**Student Author:** Shivam Bhadane  

---

## 📋 Comprehensive Curriculum Matrix

This repository contains the complete suite of practical assignments aligned with the **VIT Pune Web Technology (CS3111)** syllabus and Dr. Yashwant V. Dongre's official laboratory assignments.

| No. | Assignment Title & Scope | Technology Stack | Port | Directory | Status |
|:---:|---|---|:---:|---|:---:|
| **1** | **Responsive PHP Electricity Bill Calculator**<br>Multi-slab progressive tariff computation, live sync slider, AJAX calculations, and printable invoice statements. | PHP 8, Bootstrap 5, jQuery | `8000` | [`Assignment1_ElectricityBill/`](./Assignment1_ElectricityBill) | ✅ Completed |
| **2** | **TimeSpot: Real-Time World Clock Dashboard**<br>High-precision 60 FPS sweeping analog clock, 12h/24h digital display, global timezone manager, audio alarms, stopwatch, and timer. | React 19, Vite, SVG, Web Audio API | `5173` | [`Assignment2_ClockDashboard/`](./Assignment2_ClockDashboard) | ✅ Completed |
| **3** | **Jakarta Servlet Electricity Bill Calculator**<br>Enterprise Jakarta Servlet 6.0 backend processing HTTP GET/POST queries, progressive slab math, JSON & HTML rendering modes. | Java 21, Jakarta Servlet 6.0, Jetty EE10, Maven | `8080` | [`Assignment3_ServletElectricityBill/`](./Assignment3_ServletElectricityBill) | ✅ Completed |
| **4** | **JSP & JSTL Electricity Bill Web Application**<br>MVC architecture using reusable `TariffBean` JavaBean, JSP Standard Tag Library (`<c:if>`, `<fmt:formatNumber>`), and dynamic statement generation. | Java 21, JSP 3.1, JSTL 3.0, Maven, Jetty EE10 | `8081` | [`Assignment4_JSPElectricityBill/`](./Assignment4_JSPElectricityBill) | ✅ Completed |
| **5** | **Spring Boot VIT Semester Result Management**<br>Official VIT evaluation formula ($\text{MSE} \times 0.30 + \text{ESE} \times 0.70$), Letter Grades (`A+` to `F`), SGPA, Spring Data JPA, H2 zero-config/MySQL, Thymeleaf Grade Card. | Spring Boot 3.2, Java 21, Spring Data JPA, Thymeleaf, H2/MySQL | `8082` | [`Assignment5_SpringBootResult/`](./Assignment5_SpringBootResult) | ✅ Completed |
| **6** | **Online Book Store using React & MongoDB**<br>Component-based SPA with Home hero, Student/Faculty Login, dynamic Catalogue with search/filters, User Registration, Cart Drawer, and Mongoose NoSQL Schemas. | React 19, TypeScript 5.7, Vite 6, MongoDB / Mongoose | `5175` | [`Assignment6_BookStore_React_MongoDB/`](./Assignment6_BookStore_React_MongoDB) | ✅ Completed |
| **7** | **Interactive UML Class Diagram Generator**<br>Visual canvas for creating UML classes (attributes, methods, visibility), with real-time bidirectional Forward-Engineering Java code generation and download. | React 19, Lucide Icons, Vite 6, Forward Engineering Codegen | `5174` | [`Assignment7_UMLClassDiagramGenerator/`](./Assignment7_UMLClassDiagramGenerator) | ✅ Completed |
| **8** | **Real-Time Cricket Score Management System**<br>Scalable live scoring platform using Spring Boot REST APIs, automated ball simulation, strike-rotation engine, player statistics, and live Thymeleaf dashboard. | Spring Boot 3.2, Java 21, REST APIs, Thymeleaf, Bootstrap 5.3 | `8083` | [`Assignment8_CricketScore_SpringBoot/`](./Assignment8_CricketScore_SpringBoot) | ✅ Completed |

*(Note: `Assignment5_JDBC` is also retained as a supplemental practical for MariaDB/MySQL JDBC connection testing).*

---

## 🚀 Execution & Quick Run Guide

### Practical 1: PHP Electricity Bill Calculator
```bash
cd Assignment1_ElectricityBill
php -S localhost:8000
# Browser: http://localhost:8000
```

### Practical 2: TimeSpot Real-Time World Clock
```bash
cd Assignment2_ClockDashboard
npm install
npm run dev
# Browser: http://localhost:5173
```

### Practical 3: Jakarta Servlet Electricity Bill
```bash
cd Assignment3_ServletElectricityBill
mvn clean compile
mvn jetty:run
# Browser: http://localhost:8080
```

### Practical 4: JSP & JSTL Electricity Bill
```bash
cd Assignment4_JSPElectricityBill
mvn clean compile
mvn jetty:run
# Browser: http://localhost:8081
```

### Practical 5: Spring Boot Semester Result
```bash
cd Assignment5_SpringBootResult
mvn clean compile
mvn spring-boot:run
# Browser: http://localhost:8082
```

### Practical 6: React + MongoDB Online Book Store
```bash
cd Assignment6_BookStore_React_MongoDB
npm install
npm run dev -- --port 5175
# Browser: http://localhost:5175
```

### Practical 7: UML Class Diagram Generator
```bash
cd Assignment7_UMLClassDiagramGenerator
npm install
npm run dev -- --port 5174
# Browser: http://localhost:5174
```

### Practical 8: Real-Time Cricket Score System
```bash
cd Assignment8_CricketScore_SpringBoot
mvn clean compile
mvn spring-boot:run
# Browser: http://localhost:8083/dashboard
# REST API: http://localhost:8083/api/matches
```

---

## 📚 Technical Documentation Index

Every assignment is accompanied by comprehensive engineering documentation:
- [Assignment 1 Technical Report](./Assignment1_ElectricityBill/DOCUMENTATION.md)
- [Assignment 2 Technical Report](./Assignment2_ClockDashboard/DOCUMENTATION.md)
- [Assignment 3 Technical Report](./Assignment3_ServletElectricityBill/DOCUMENTATION.md)
- [Assignment 4 Technical Report](./Assignment4_JSPElectricityBill/DOCUMENTATION.md)
- [Assignment 5 Technical Report](./Assignment5_SpringBootResult/DOCUMENTATION.md)
- [Assignment 6 Technical Report](./Assignment6_BookStore_React_MongoDB/DOCUMENTATION.md)
- [Assignment 7 Technical Report](./Assignment7_UMLClassDiagramGenerator/DOCUMENTATION.md)
- [Assignment 8 Technical Report](./Assignment8_CricketScore_SpringBoot/DOCUMENTATION.md)

---

## 🛡️ Academic Integrity
Developed for academic assessment at **Vishwakarma Institute of Technology (VIT), Pune**.
All practicals comply strictly with the laboratory rubric and modern enterprise development standards.
