# Academic Practical Report: Practical 7

## Vishwakarma Institute of Technology, Pune
**Department of Computer Engineering**  
**Course Code & Name:** CS3111 — Web Technologies  
**Academic Year:** 2026–2027 | **Semester:** IV / V  

---

### Practical Title
**Build an interactive web-based UML Class Diagram Generator using React that enables users to visually create UML class diagrams and automatically generate corresponding Java source code based on the designed architecture.**

---

## 1. Objectives
1. To implement an interactive diagramming user interface using **React 19 functional components and state hooks**.
2. To understand standard **UML (Unified Modeling Language) Class Notations**: 3-compartment structure, visibility symbols (`+`, `-`, `#`), stereotypes (`<<abstract>>`, `<<interface>>`), and relationships (`extends`, `implements`).
3. To design a modular **Code Generation Engine** translating visual AST (Abstract Syntax Tree) representations into syntactically valid Java class definitions.
4. To implement productivity features including one-click clipboard copying and `.java` file downloads.

---

## 2. Theory & Concept

### 2.1 UML Class Representation
In software engineering, a Class Diagram visually documents the static structure of a system:
```
┌──────────────────────────────────────────────┐
│                  ClassName                   │  <-- Compartment 1: Name & Stereotype
├──────────────────────────────────────────────┤
│ - id: int                                    │  <-- Compartment 2: Attributes
│ - name: String                               │      (visibility + name + type)
├──────────────────────────────────────────────┤
│ + getId(): int                               │  <-- Compartment 3: Methods
│ + setName(String): void                      │      (visibility + name + params + return)
└──────────────────────────────────────────────┘
```

### 2.2 Visibility Notations
* `+` : **Public** — Accessible from any class.
* `-` : **Private** — Accessible only within declared class.
* `#` : **Protected** — Accessible within package and sub-classes.
* `~` : **Package / Default** — Accessible within package.

---

## 3. Code Generator Architecture

The translation engine (`javaGenerator.js`) performs AST-to-code synthesis:
1. **Package & Imports:** Emits standard package declarations and utility imports.
2. **Class Signature:** Appends `extends ParentClass` or `implements Interface1, Interface2`.
3. **Encapsulation:** Converts attributes into private fields and generates corresponding getter and setter methods.
4. **Constructors:** Emits zero-argument default constructors and full parameterized constructors chaining to `super()` when inherited.
5. **Method Stubs:** Generates method signatures with typed return defaults.

---

## 4. Test Scenarios & Verification

| Test Case | Visual Model Input | Generated Java Output | Status |
|---|---|---|---|
| **Class Creation** | Name: `Person`, Abstract: `true` | `public abstract class Person { ... }` | ✅ PASS |
| **Inheritance** | Class: `Student`, Parent: `Person` | `public class Student extends Person { ... }` | ✅ PASS |
| **Encapsulation** | Field: `- prn: String` | `private String prn; public String getPrn() { ... } public void setPrn(String prn) { ... }` | ✅ PASS |
| **Constructor Chaining**| Parameterized constructor with parent | Emits `super(); this.prn = prn;` | ✅ PASS |

---

## 5. Viva / Oral Questions & Answers

1. **Q: What is the benefit of generating code from UML diagrams (Forward Engineering)?**  
   *A:* Forward engineering ensures architectural consistency between design models and codebases, eliminates manual boilerplate writing (getters, setters, constructors), and speeds up software prototyping.

2. **Q: How does React handle real-time code generation without freezing the browser?**  
   *A:* React utilizes unidirectional data flow where state updates (`classes` array) trigger lightweight re-renders of pure functional components. Because the code generator is a pure deterministic JavaScript function, computation completes in under 2 milliseconds for typical diagrams.

3. **Q: How does UML represent Generalization vs Realization?**  
   *A:* **Generalization** (Inheritance between classes) is represented by a solid line with a hollow triangle arrowhead (`extends`). **Realization** (Class implementing an interface) is represented by a dashed line with a hollow triangle arrowhead (`implements`).

---

## 6. Conclusion
The Web-Based UML Class Diagram Generator was successfully engineered using React 19 and Vite. The system seamlessly translates visual object-oriented class specifications into production-ready Java code in real-time, bridging visual architecture and software implementation.
