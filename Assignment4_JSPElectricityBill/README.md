# Practical 4: Electricity Bill Calculator using Advanced JSP Features

**Course**: CS3111: Web Technologies  
**Institution**: Vishwakarma Institute of Technology (VIT Pune)  
**Academic Year**: 2026–27  
**Tech Stack**: Java 21, JSP 3.1, JSTL 3.0, JavaBeans, Bootstrap 5.3, Maven  

---

## 1. Problem Statement & Objective

Design and develop a responsive website to calculate electricity bills using **advanced JSP features** (JSTL, Expression Language, JavaBeans).

### Tariff Slab Structure:
* **Slab 1 (1 - 50 units)**: Rs. 3.50 / unit
* **Slab 2 (51 - 150 units)**: Rs. 4.00 / unit
* **Slab 3 (151 - 250 units)**: Rs. 5.20 / unit
* **Slab 4 (Units above 250)**: Rs. 6.50 / unit
* **Fixed Nominal Charge**: Rs. 50.00
* **Electricity Duty**: 9%

---

## 2. Advanced JSP Features Implemented

1. **JavaBeans Integration (`TariffBean.java`)**:
   - Implements `java.io.Serializable` with standard zero-argument constructor and private fields.
   - Instantiated and populated automatically using JSP standard actions:
     ```jsp
     <jsp:useBean id="tariff" class="com.vit.wt.beans.TariffBean" scope="request" />
     <jsp:setProperty name="tariff" property="*" />
     ```
2. **JSP Standard Tag Library (JSTL Core & Formatting)**:
   - `<c:if>` and `<c:choose>` conditional rendering to dynamically highlight active slabs.
   - `<fmt:formatNumber>` for currency (`₹`) and number decimal precision.
3. **Expression Language (`${}`)**:
   - Clean, scriptlet-free rendering: `${tariff.totalPayable}`, `${tariff.units}`.
4. **Bi-directional Client Sync**:
   - jQuery range slider and numeric inputs synced in real-time.

---

## 3. Quickstart & Local Execution

```bash
cd Assignment4_JSPElectricityBill
mvn jetty:run
```

Open your browser at:  
👉 **`http://localhost:8081/`**

---

## 4. Test Cases Verification

| Test Scenario | Units | Energy Charges | Duty (9%) + Fixed (₹50) | Total Payable |
|---|---|---|---|---|
| **Slab 1 (40 units)** | 40 | Rs. 140.00 | Rs. 12.60 + 50.00 | **Rs. 202.60** |
| **Slab 2 (120 units)**| 120 | 175 + 280 = Rs. 455.00 | Rs. 40.95 + 50.00 | **Rs. 545.95** |
| **Slab 3 (200 units)**| 200 | 175 + 400 + 260 = Rs. 835.00 | Rs. 75.15 + 50.00 | **Rs. 960.15** |
| **Slab 4 (300 units)**| 300 | 175 + 400 + 520 + 325 = Rs. 1420.00 | Rs. 127.80 + 50.00 | **Rs. 1597.80** |
