# Academic Practical Report: Practical 3

## Vishwakarma Institute of Technology, Pune
**Department of Computer Engineering**  
**Course Code & Name:** CS3111 — Web Technologies  
**Academic Year:** 2026–2027 | **Semester:** IV / V  

---

### Practical Title
**Design and develop a responsive website to calculate Electricity bill using Java Servlets, Bootstrap, and jQuery.**

---

## 1. Objectives
1. To understand the **Jakarta Servlet Architecture** and the request-response lifecycle (`init()`, `service()`, `doGet()`, `doPost()`, `destroy()`).
2. To implement multi-tier slab calculation logic on the server side using Java.
3. To build a responsive client interface using **Bootstrap 5.3** and **jQuery** for bi-directional range-number synchronization.
4. To integrate AJAX client-server communication alongside traditional form submission.

---

## 2. Theory & Concept

### 2.1 What is a Java Servlet?
A **Servlet** is a Java programming language class that is used to extend the capabilities of servers that host applications accessed by means of a request-response programming model. In web applications, servlets typically handle HTTP requests sent by client browsers.

### 2.2 Servlet Lifecycle
```
       Client Request
             │
             ▼
   [ Class Loading & Instantiation ]
             │
             ▼
         init()           <-- Called once when servlet is loaded
             │
             ▼
       service()          <-- Dispatches to doGet() / doPost() for every request
             │
             ▼
        destroy()         <-- Called once when container shuts down
```

### 2.3 Slab-Based Tariff Calculation Formula
Electricity utility boards categorize consumption into progressive tiers (slabs) so that essential consumption is charged at lower rates, while higher consumption is billed progressively higher:

$$\text{Energy Charges} = \sum (\text{Units in Slab}_i \times \text{Rate}_i)$$

* **Slab 1 (0 to 50 units):** $\text{Units}_1 = \min(U, 50)$, $\text{Cost}_1 = \text{Units}_1 \times 3.50$
* **Slab 2 (51 to 150 units):** $\text{Units}_2 = \min(\max(U - 50, 0), 100)$, $\text{Cost}_2 = \text{Units}_2 \times 4.00$
* **Slab 3 (151 to 250 units):** $\text{Units}_3 = \min(\max(U - 150, 0), 100)$, $\text{Cost}_3 = \text{Units}_3 \times 5.20$
* **Slab 4 (> 250 units):** $\text{Units}_4 = \max(U - 250, 0)$, $\text{Cost}_4 = \text{Units}_4 \times 6.50$

$$\text{Total Payable} = \text{Energy Charges} + \text{Fixed Charges (₹50)} + \text{Duty (9\%)}$$

---

## 3. Implementation Code Highlights

### `ElectricityBillServlet.java` (Tariff Engine):
```java
public static BillResult calculateBill(double units) {
    BillResult b = new BillResult();
    b.units = units;
    double remaining = units;

    if (remaining > 0) {
        b.slab1Units = Math.min(remaining, 50.0);
        b.slab1Cost = b.slab1Units * 3.50;
        remaining -= b.slab1Units;
    }
    if (remaining > 0) {
        b.slab2Units = Math.min(remaining, 100.0);
        b.slab2Cost = b.slab2Units * 4.00;
        remaining -= b.slab2Units;
    }
    if (remaining > 0) {
        b.slab3Units = Math.min(remaining, 100.0);
        b.slab3Cost = b.slab3Units * 5.20;
        remaining -= b.slab3Units;
    }
    if (remaining > 0) {
        b.slab4Units = remaining;
        b.slab4Cost = b.slab4Units * 6.50;
    }

    b.totalEnergyCharges = b.slab1Cost + b.slab2Cost + b.slab3Cost + b.slab4Cost;
    b.electricityDuty = b.totalEnergyCharges * 0.09;
    b.totalPayable = b.totalEnergyCharges + b.fixedCharges + b.electricityDuty;
    return b;
}
```

---

## 4. Test Scenarios & Results

| Test # | Scenario | Input Units | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **1** | Boundary Slab 1 | 50 | (50 × 3.5) + 50 + 9% = ₹240.75 | ₹240.75 | ✅ PASS |
| **2** | Within Slab 2 | 100 | 175 + 200 + 50 + 33.75 = ₹458.75 | ₹458.75 | ✅ PASS |
| **3** | Within Slab 3 | 200 | 175 + 400 + 260 + 50 + 75.15 = ₹960.15 | ₹960.15 | ✅ PASS |
| **4** | High Usage (Slab 4) | 300 | 175 + 400 + 520 + 325 + 50 + 127.80 = ₹1597.80 | ₹1597.80 | ✅ PASS |
| **5** | Zero Usage | 0 | ₹50.00 (Fixed Charge only) | ₹50.00 | ✅ PASS |

---

## 5. Viva / Oral Questions & Answers

1. **Q: What is the difference between `doGet()` and `doPost()` in a Servlet?**  
   *A:* `doGet()` receives form parameters encoded in the URL query string, has length restrictions, and should be idempotent (safe to retry/cache). `doPost()` sends data in the HTTP request body, is more secure for passwords/large data, and is used for operations that modify server state.

2. **Q: Why is `@WebServlet` used instead of `web.xml` configuration?**  
   *A:* Introduced in Servlet 3.0, the `@WebServlet` annotation enables declarative servlet registration without needing verbose XML mapping in `web.xml`, making the application modular and easier to maintain.

3. **Q: What is the benefit of progressive multi-slab tariffs?**  
   *A:* It encourages electricity conservation. Low-income households and low consumers are subsidized with low rates (e.g. ₹3.50), while excessive power consumption is penalized at higher rates (e.g. ₹6.50).

---

## 6. Conclusion
The Responsive Electricity Bill Calculator was successfully built and tested using Java Servlet 6.0 and modern front-end technologies (Bootstrap 5 & jQuery). The application reliably calculates multi-tier progressive power bills and renders both interactive live previews and printable official tax invoices.
