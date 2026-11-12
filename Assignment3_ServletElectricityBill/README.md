# Practical 3: Responsive Electricity Bill Calculator using Java Servlet

**Course**: CS3111: Web Technologies  
**Institution**: Vishwakarma Institute of Technology (VIT Pune)  
**Academic Year**: 2026–27  
**Tech Stack**: Java 21, Jakarta Servlet 6.0, HTML5, Bootstrap 5.3, jQuery 3.7, Maven  

---

## 1. Problem Statement & Objective

Design and develop a responsive website to calculate electricity bills with the help of any code generation AI tool using **Java Servlets**.

### Tariff Slab Structure:
* **Slab 1 (First 50 units)**: Rs. 3.50 / unit
* **Slab 2 (Next 100 units, 51 - 150)**: Rs. 4.00 / unit
* **Slab 3 (Next 100 units, 151 - 250)**: Rs. 5.20 / unit
* **Slab 4 (Units above 250)**: Rs. 6.50 / unit
* **Fixed Charges**: Rs. 50.00 nominal meter fee
* **Government Electricity Duty**: 9% on total energy charges

---

## 2. Architecture & Design

```
   ┌──────────────┐         POST /calculate (form data)         ┌────────────────────────┐
   │              │ ──────────────────────────────────────────► │                        │
   │ Web Browser  │                                             │ ElectricityBillServlet │
   │ (Bootstrap + │ ◄────────────────────────────────────────── │ (Jakarta Servlet 6.0)  │
   │   jQuery)    │        HTML Invoice / JSON API response     │                        │
   └──────────────┘                                             └───────────┬────────────┘
                                                                            │
                                                                   ┌────────┴────────┐
                                                                   │ Multi-Slab      │
                                                                   │ Calculation     │
                                                                   │ Engine          │
                                                                   └─────────────────┘
```

1. **Client Layer (`index.html`)**: Responsive input form with bi-directional synchronization between the range slider and number input via jQuery, plus real-time visual highlight of active tariff slabs.
2. **Controller Layer (`ElectricityBillServlet.java`)**: 
   - Handles `POST` requests at `/calculate`.
   - Validates user input (checking for non-numeric, empty, or negative units).
   - Computes exact consumption breakdown across all 4 slabs.
   - Generates an itemized, printable tax invoice.
3. **API Mode**: Supports `format=json` or standard AJAX header `X-Requested-With: XMLHttpRequest` for client-side live estimates without page reload.

---

## 3. Quickstart & Execution

### Prerequisites:
* Java 21+ (`openjdk-21`)
* Apache Maven 3.9+

### Run with Embedded Jetty Server:
```bash
cd Assignment3_ServletElectricityBill
mvn jetty:run
```

Open your browser and navigate to:  
👉 **`http://localhost:8080/`**

### Package as standard WAR:
```bash
mvn clean package
# War file created at: target/servlet-bill.war
```
Deploy `servlet-bill.war` to Apache Tomcat 10+ `webapps/` folder if using a standalone container.

---

## 4. Test Cases Verification

| Test Case | Input Units | Slab Breakdown | Fixed + Duty | Total Payable |
|---|---|---|---|---|
| **Case 1** | `40 units` | 40 × 3.50 = Rs. 140.00 | 50.00 + 12.60 | **Rs. 202.60** |
| **Case 2** | `100 units` | (50 × 3.50) + (50 × 4.00) = Rs. 375.00 | 50.00 + 33.75 | **Rs. 458.75** |
| **Case 3** | `200 units` | 175 + 400 + (50 × 5.20) = Rs. 835.00 | 50.00 + 75.15 | **Rs. 960.15** |
| **Case 4** | `300 units` | 175 + 400 + 520 + (50 × 6.50) = Rs. 1420.00 | 50.00 + 127.80 | **Rs. 1597.80** |
