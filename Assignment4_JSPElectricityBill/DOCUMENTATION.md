# Academic Practical Report: Practical 4

## Vishwakarma Institute of Technology, Pune
**Department of Computer Engineering**  
**Course Code & Name:** CS3111 — Web Technologies  
**Academic Year:** 2026–2027 | **Semester:** IV / V  

---

### Practical Title
**Design and develop a responsive website to calculate Electricity bill using advanced JSP features (JSTL, Expression Language, and JavaBeans).**

---

## 1. Objectives
1. To understand the **JavaServer Pages (JSP) Lifecycle** (Translation, Compilation, Loading, Initialization, Execution, Destruction).
2. To separate business logic from presentation using the **JavaBean architecture** (`<jsp:useBean>`, `<jsp:setProperty>`).
3. To eliminate Java scriptlet code (`<% ... %>`) using modern **Expression Language (`${}`)** and **JSTL Core / Formatting tags**.
4. To implement progressive slab-based tariff calculations for electricity consumer billing.

---

## 2. Theory & Concept

### 2.1 What is JSP and how does it work?
JSP is a server-side technology that allows developers to embed Java code within static HTML markup. When a client requests a `.jsp` file for the first time:
1. The **JSP Engine** translates the `.jsp` into a Java Servlet source file (`.java`).
2. The servlet is compiled into bytecode (`.class`).
3. The generated servlet's `_jspService()` method handles the client request and returns the resulting HTML.

### 2.2 Why Advanced JSP (JSTL & Expression Language)?
Traditional JSP used scriptlets (`<% code %>`), which mixed Java business logic with HTML markup, leading to unmaintainable "spaghetti code".  
Modern JSP standards advocate for **Scriptlet-Free Architecture**:
* **JavaBeans**: Encapsulates data and business logic in standard POJO classes.
* **Expression Language (EL)**: Concise syntax `${bean.property}` to access scoped attributes.
* **JSTL (JSP Standard Tag Library)**: Standardized tags for loops (`<c:forEach>`), conditionals (`<c:if>`, `<c:choose>`), and number formatting (`<fmt:formatNumber>`).

---

## 3. Code Implementation Details

### JavaBean Declaration in `index.jsp`:
```jsp
<%-- Auto-populates bean properties matching HTTP POST parameters --%>
<jsp:useBean id="tariff" class="com.vit.wt.beans.TariffBean" scope="request" />
<jsp:setProperty name="tariff" property="*" />
```

### JSTL Conditional Slab Highlight:
```jsp
<div class="slab-box text-center <c:if test='${tariff.activeSlabNumber == 1}'>active</c:if>">
    <span class="badge bg-success-subtle text-success">Slab 1</span>
    <h4>₹3.50</h4>
</div>
```

### JSTL Currency Formatting:
```jsp
<fmt:formatNumber value="${tariff.totalPayable}" type="currency" currencySymbol="₹ "/>
```

---

## 4. Test Verification Scenarios

| Test Case | Inputs | Formula Applied | Total Result | Status |
|---|---|---|---|---|
| **Test 1** | Units = 40 | 40 × 3.50 = 140; Fixed = 50; Duty = 12.60 | **₹202.60** | ✅ PASS |
| **Test 2** | Units = 100 | (50×3.50) + (50×4.00) = 375; Fixed = 50; Duty = 33.75 | **₹458.75** | ✅ PASS |
| **Test 3** | Units = 200 | 175 + 400 + (50×5.20) = 835; Fixed = 50; Duty = 75.15 | **₹960.15** | ✅ PASS |
| **Test 4** | Units = 300 | 175 + 400 + 520 + (50×6.50) = 1420; Fixed = 50; Duty = 127.80 | **₹1597.80** | ✅ PASS |

---

## 5. Viva / Oral Questions & Answers

1. **Q: What is the purpose of `<jsp:setProperty name="bean" property="*" />`?**  
   *A:* The wildcard `*` automatically inspects all incoming HTTP request parameters and matches them to corresponding JavaBean setter methods by name (e.g., parameter `units` invokes `setUnits()`), eliminating repetitive manual parameter extraction.

2. **Q: What is the difference between `<jsp:include>` and `<%@ include %>`?**  
   *A:* `<%@ include file="..." %>` is a **translation-time directive** that physically merges the contents of the target file before compilation into a servlet. `<jsp:include page="..." />` is a **runtime standard action** that dynamically delegates request processing to the target resource at execution time.

3. **Q: How does JSP compare to Java Servlet?**  
   *A:* Servlets are Java classes with embedded HTML (better suited for controller logic), whereas JSP is HTML with embedded tags/Java (better suited for the view layer). Together, they form the Model-View-Controller (MVC) architecture.

---

## 6. Conclusion
The advanced JSP Electricity Bill application successfully implements a scriptlet-free, MVC-aligned web solution utilizing JavaBeans, JSTL core and formatting libraries, and Expression Language. The interface provides fluid user input and compliant billing records.
