# Academic Practical Report: Practical 5

## Vishwakarma Institute of Technology, Pune
**Department of Computer Engineering**  
**Course Code & Name:** CS3111 — Web Technologies  
**Academic Year:** 2026–2027 | **Semester:** IV / V  

---

### Practical Title
**Design and develop a responsive website to prepare one semester result of VIT students using Spring Boot and MySQL (4 subjects with MSE 30% and ESE 70% weightage).**

---

## 1. Objectives
1. To understand the **Spring Boot Architecture** and rapid application configuration (Auto-Configuration, Embedded Server, Starter dependencies).
2. To implement object-relational mapping (ORM) using **Spring Data JPA** and **Hibernate**.
3. To calculate weighted semester marks using the autonomous formula:
   $$\text{Final Marks} = (\text{MSE} \times 0.30) + (\text{ESE} \times 0.70)$$
4. To build both a **Thymeleaf-rendered web frontend** and a **RESTful JSON API**.

---

## 2. Theory & Concept

### 2.1 Why Spring Boot?
Spring Boot simplifies enterprise Java development by eliminating manual XML configuration. Key features include:
* **Auto-Configuration:** Automatically configures DataSource, EntityManager, and DispatcherServlet based on classpath jars.
* **Embedded Web Server:** Packs Tomcat inside the executable JAR/WAR.
* **Spring Data JPA:** Provides `JpaRepository<T, ID>` with built-in CRUD operations (`save`, `findById`, `findAll`, `delete`) without writing manual SQL queries.

### 2.2 Semester Result Calculation Engine
VIT Pune autonomous grading calculates continuous internal evaluation (MSE) and final summative evaluation (ESE):
* **Credit Weightage:** MSE carries 30% weightage, ESE carries 70% weightage.
* **Course Grade Points:**
  * Marks $\ge 90$: $O$ (10 points)
  * Marks $\ge 80$: $A+$ (9 points)
  * Marks $\ge 70$: $A$ (8 points)
  * Marks $\ge 60$: $B+$ (7 points)
  * Marks $\ge 55$: $B$ (6 points)
  * Marks $\ge 40$: $C$ (5 points)
  * Marks $< 40$: $F$ (0 points)
* **Semester Grade Point Average (SGPA):**
  $$\text{SGPA} = \frac{\sum_{i=1}^{4} \text{GradePoints}_i}{4}$$

---

## 3. Code Implementation Highlights

### JPA Entity (`StudentResult.java`):
```java
@Entity
@Table(name = "student_results")
public class StudentResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String prn;
    private String studentName;
    private double sub1Mse, sub1Ese, sub1Total;
    private String sub1Grade;
    private int sub1GradePoints;
    // ... other subjects and getters/setters
}
```

### Grade Calculation (`ResultService.java`):
```java
student.setSub1Total(round((student.getSub1Mse() * 0.30) + (student.getSub1Ese() * 0.70)));
student.setSub1Grade(computeGrade(student.getSub1Total()));
student.setSub1GradePoints(computeGradePoints(student.getSub1Total()));
```

---

## 4. Test Verification Scenarios

| Test Case | Inputs | Formula Applied | Subject Total & Grade | Status |
|---|---|---|---|---|
| **Test 1** | MSE = 90, ESE = 90 | (90 × 0.3) + (90 × 0.7) = 27 + 63 | **90.0 (O, 10 pts)** | ✅ PASS |
| **Test 2** | MSE = 70, ESE = 80 | (70 × 0.3) + (80 × 0.7) = 21 + 56 | **77.0 (A, 8 pts)** | ✅ PASS |
| **Test 3** | MSE = 40, ESE = 35 | (40 × 0.3) + (35 × 0.7) = 12 + 24.5 | **36.5 (F, 0 pts)** | ✅ PASS |
| **Test 4** | SGPA 4 Subjects | Grade Points: 10, 9, 8, 10 | (10+9+8+10)/4 = **9.25** | ✅ PASS |

---

## 5. Viva / Oral Questions & Answers

1. **Q: What is the purpose of `@SpringBootApplication`?**  
   *A:* It is a convenience annotation that bundles three key annotations: `@Configuration` (defines Spring beans), `@EnableAutoConfiguration` (enables automatic classpath configuration), and `@ComponentScan` (enables scanning for controllers, services, and repositories in the package).

2. **Q: How does Spring Data JPA eliminate boilerplate DAO code?**  
   *A:* By extending `JpaRepository<Entity, ID>`, Spring generates implementation classes at runtime with methods like `findAll()`, `findById()`, and `save()`, as well as dynamic query generation from method names (e.g. `findByPrn(String prn)`).

3. **Q: How does Thymeleaf differ from traditional JSP?**  
   *A:* Thymeleaf is a modern XML/XHTML/HTML5 template engine that is **Natural Templating** compliant—meaning Thymeleaf templates can be opened directly in any browser as static prototypes even without a server running.

---

## 6. Conclusion
The Spring Boot Semester Result application successfully realizes end-to-end continuous evaluation calculations for VIT students. The system demonstrates robust Spring Data JPA persistence, clean service layer abstraction, and official grade card generation.
