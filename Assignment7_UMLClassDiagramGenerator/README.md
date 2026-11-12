# Practical 7: Web-Based UML Class Diagram Generator using React

**Course**: CS3111: Web Technologies  
**Institution**: Vishwakarma Institute of Technology (VIT Pune)  
**Academic Year**: 2026–27  
**Tech Stack**: React 19, Vite, Lucide React, HTML5 Canvas / SVG, CSS Grid  

---

## 1. Problem Statement & Objective

Build an interactive web-based **UML Class Diagram Generator using React** that enables users to visually create UML class diagrams and automatically generate corresponding **Java source code** based on the designed architecture.

### Key Capabilities:
1. **Interactive Class Canvas**: Visual 3-compartment UML representation (Class Name, Attributes, Methods).
2. **Access Modifiers & Stereotypes**: Support for `+` (public), `-` (private), `#` (protected), `<<interface>>`, and `<<abstract>>`.
3. **OOP Relationships**: Inheritance (`extends`), Interface implementation (`implements`), and associations.
4. **Real-Time Java Codegen Engine**: Generates valid Java code with constructors, getters, setters, methods, and packages in real-time as the diagram is manipulated.
5. **One-Click Export**: Copy to clipboard or download `.java` source files directly.

---

## 2. Architecture & Design

```
   ┌────────────────────────────────────────────────────────┐
   │                  React 19 Application                  │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
               ▼                                ▼
   ┌───────────────────────┐        ┌───────────────────────┐
   │  Visual UML Canvas    │        │  Java Codegen Engine  │
   │  - 3-Compartment Card │ ─────► │  (javaGenerator.js)   │
   │  - Dynamic Modifiers  │        │  - Constructors       │
   │  - Relationship Links │        │  - Getters / Setters  │
   └───────────────────────┘        │  - Abstract / Interface│
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Syntax Highlighted    │
                                    │ Java Code Output      │
                                    └───────────────────────┘
```

---

## 3. Quickstart & Local Execution

```bash
cd Assignment7_UMLClassDiagramGenerator
npm install
npm run dev
```

Open browser at:  
👉 **`http://localhost:5174/`**

### Production Build:
```bash
npm run build
```
Build bundle created inside `dist/`.
