# Practical 1: Responsive PHP Electricity Bill Calculator

> **Course**: Web Technologies  
> **Tech Stack**: PHP 8+, HTML5, CSS3 (Glassmorphism), Bootstrap 5.3, jQuery 3.7  
> **Design Strategy**: Responsive AI-Assisted UI / ChatGPT Code Generation  

---

## 📌 Problem Statement & Requirements

Design and develop a responsive website with the help of any code generation AI tool (like ChatGPT) to calculate electricity bills using **PHP**.

### Tariff Slab Structure:
1. **First 50 Units**: Rs. 3.50 / unit
2. **Next 100 Units** (51 – 150): Rs. 4.00 / unit
3. **Next 100 Units** (151 – 250): Rs. 5.20 / unit
4. **Units Above 250** (> 250): Rs. 6.50 / unit

---

## ✨ Features Implemented

1. **Dual PHP & AJAX Processing**:
   - Pure PHP server-side form evaluation (`POST` handler in `index.php`).
   - Asynchronous AJAX calculation (`calculate.php` JSON endpoint) for zero-reload dynamic updates.

2. **Synchronous Live Input Sync**:
   - HTML5 range slider + numeric input synced in real-time using **jQuery**.
   - Active slab cards highlight dynamically based on current unit range.
   - Animated progress bar showing cost distribution percentages across slabs.

3. **Appliance Consumption Estimator**:
   - Calculate estimated monthly kWh consumption by entering household devices, power ratings (Watts), quantity, and daily operating hours.
   - One-click load into the main bill calculator.

4. **Printable Invoice & PDF Generator**:
   - Official utility statement modal with itemized tariff table, metadata, and CSS `@media print` optimized layout.

5. **AI Code Generation Log**:
   - Interactive prompt showcase section documenting the ChatGPT prompts used for PHP logic, Bootstrap layout, and jQuery handlers.

6. **Calculation History**:
   - Remembers past 10 bill estimates using browser `localStorage`.

---

## 📁 Directory Structure

```text
Assignment1_ElectricityBill/
├── assets/
│   ├── css/
│   │   └── style.css       # Custom glassmorphic styles & CSS variables
│   └── js/
│       └── app.js          # jQuery live sync, AJAX, estimator, & print handlers
├── calculate.php           # PHP Backend tariff calculation engine & AJAX API
├── index.php               # Main responsive web interface
├── README.md               # Quick setup guide & summary
└── DOCUMENTATION.md        # Comprehensive academic lab report
```

---

## 🚀 How to Run Locally

### Prerequisites
- PHP 8.0 or higher installed on your machine.

### Execution Steps
1. Open terminal in `Assignment1_ElectricityBill`:
   ```bash
   cd Assignment1_ElectricityBill
   ```
2. Start the built-in PHP development server:
   ```bash
   php -S localhost:8000
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8000
   ```

---

## 🧪 Test Cases & Calculation Verification

| Consumed Units | Formula Breakdown | Energy Charge | Fixed Charge | 5% Tax | Grand Total | Active Slab |
|---|---|---|---|---|---|---|
| **30 Units** | 30 × ₹3.50 | ₹105.00 | ₹50.00 | ₹5.25 | **₹160.25** | Slab 1 |
| **100 Units** | (50 × ₹3.50) + (50 × ₹4.00) | ₹375.00 | ₹50.00 | ₹18.75 | **₹443.75** | Slab 2 |
| **200 Units** | (50 × ₹3.50) + (100 × ₹4.00) + (50 × ₹5.20) | ₹835.00 | ₹50.00 | ₹41.75 | **₹926.75** | Slab 3 |
| **300 Units** | (50 × ₹3.50) + (100 × ₹4.00) + (100 × ₹5.20) + (50 × ₹6.50) | ₹1420.00 | ₹50.00 | ₹71.00 | **₹1541.00** | Slab 4 |

---

## 📜 License & Academic Integrity
Developed as part of the **Web Technologies Practical Coursework**.
