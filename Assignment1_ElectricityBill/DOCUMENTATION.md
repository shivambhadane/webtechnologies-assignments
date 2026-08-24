# ACADEMIC PRACTICAL REPORT: PRACTICAL #1
## Design and Development of a Responsive PHP Electricity Bill Calculator Using AI Prompt Engineering

---

### 📋 PRACTICAL METADATA
- **Course Title**: Web Technologies
- **Practical Assignment**: Practical #1 (Minimum Six Series)
- **Topic**: Responsive Web Development with PHP, Bootstrap, and jQuery
- **AI Tool Used**: ChatGPT / Gemini AI Prompt Engineering
- **Date**: August 2026

---

## 1. OBJECTIVE & MOTIVATION

The objective of this practical assignment is to design, implement, and validate a responsive web application that calculates monthly electricity billing statements based on a tiered multi-slab tariff rate system using **PHP**.

### Specific Slab Conditions:
- **First 50 units (0 – 50)**: `Rs. 3.50` per unit
- **Next 100 units (51 – 150)**: `Rs. 4.00` per unit
- **Next 100 units (151 – 250)**: `Rs. 5.20` per unit
- **Units above 250 (> 250)**: `Rs. 6.50` per unit

---

## 2. TECHNICAL SPECIFICATIONS & STACK

| Layer | Technology / Framework | Functionality |
|---|---|---|
| **Server-Side Engine** | PHP 8.5+ | Mathematical calculation logic, POST form processing, AJAX API endpoint |
| **Styling & Layout** | Bootstrap 5.3 + Custom CSS | Responsive grid, flexbox, glassmorphic dark/light design system |
| **Client Interactivity** | jQuery 3.7.1 | Synchronous unit range slider sync, active slab highlights, AJAX execution |
| **Typography & Icons** | FontAwesome 6.5 & Google Fonts | Visual indicators, iconography, modern readability |
| **AI Tool Context** | ChatGPT Prompting | Prompts embedded for automated component synthesis and validation |

---

## 3. MATHEMATICAL ALGORITHM & PHP IMPLEMENTATION

The mathematical model splits consumed kWh units ($U$) into four non-overlapping range intervals:

$$U = u_1 + u_2 + u_3 + u_4$$

Where:
- $u_1 = \min(U, 50)$
- $u_2 = \min(\max(U - 50, 0), 100)$
- $u_3 = \min(\max(U - 150, 0), 100)$
- $u_4 = \max(U - 250, 0)$

### Cost Calculations:
$$\text{Cost}_{1} = u_1 \times 3.50$$
$$\text{Cost}_{2} = u_2 \times 4.00$$
$$\text{Cost}_{3} = u_3 \times 5.20$$
$$\text{Cost}_{4} = u_4 \times 6.50$$

$$\text{Energy Charges} = \sum_{i=1}^{4} \text{Cost}_{i}$$
$$\text{Fixed Charge} = \begin{cases} 50.00 & \text{if } U > 0 \\ 0.00 & \text{if } U = 0 \end{cases}$$
$$\text{State Tax (5\%)} = \text{Energy Charges} \times 0.05$$
$$\text{Grand Total} = \text{Energy Charges} + \text{Fixed Charge} + \text{State Tax}$$

### Core PHP Function (`calculate.php` snippet):
```php
function calculateElectricityBill($units) {
    $units = max(0, floatval($units));
    $remaining = $units;

    $s1_units = min($remaining, 50);
    $s1_cost  = $s1_units * 3.50;
    $remaining -= $s1_units;

    $s2_units = min($remaining, 100);
    $s2_cost  = $s2_units * 4.00;
    $remaining -= $s2_units;

    $s3_units = min($remaining, 100);
    $s3_cost  = $s3_units * 5.20;
    $remaining -= $s3_units;

    $s4_units = max($remaining, 0);
    $s4_cost  = $s4_units * 6.50;

    $totalEnergy = $s1_cost + $s2_cost + $s3_cost + $s4_cost;
    $fixedCharge = ($units > 0) ? 50.00 : 0.00;
    $tax = $totalEnergy * 0.05;
    $grandTotal = $totalEnergy + $fixedCharge + $tax;

    return [
        'units' => $units,
        'totalEnergyCharges' => round($totalEnergy, 2),
        'fixedCharge' => round($fixedCharge, 2),
        'govTax' => round($tax, 2),
        'grandTotal' => round($grandTotal, 2),
        'slabs' => [...]
    ];
}
```

---

## 4. AI PROMPT ENGINEERING LOG

As per assignment instructions, AI code generation was utilized to synthesize components. Below are the prompts engineered during development:

### Prompt 1 (PHP Tariff Engine):
> *"Write a robust PHP function `calculateElectricityBill($units)` that calculates electricity cost based on 4 slabs: first 50 units @ Rs 3.50, next 100 @ Rs 4.00, next 100 @ Rs 5.20, above 250 @ Rs 6.50. Include fixed charge and 5% tax. Return a detailed array and support AJAX JSON response."*

### Prompt 2 (Bootstrap Glassmorphism UI):
> *"Create a modern glassmorphic dashboard using Bootstrap 5 and FontAwesome. Include dark/light mode toggle, input slider synced with numeric box, visual active slab cards, progress bar for cost breakdown, and printable invoice modal."*

### Prompt 3 (jQuery Interactivity & Appliance Estimator):
> *"Implement jQuery scripts to handle real-time unit synchronization, AJAX POST form processing, appliance power estimation (Watts × Qty × Hours / 1000), and LocalStorage history tracking."*

---

## 5. EXPERIMENTAL RESULTS & TEST MATRIX

| Test ID | Input Units | Expected Energy Charge | Fixed Charge | Duty (5%) | Total Calculated | Status |
|---|---|---|---|---|---|---|
| `TC-01` | 0 | ₹0.00 | ₹0.00 | ₹0.00 | ₹0.00 | PASS |
| `TC-02` | 45 | 45 × 3.50 = ₹157.50 | ₹50.00 | ₹7.88 | ₹215.38 | PASS |
| `TC-03` | 120 | 175 + (70 × 4.00) = ₹455.00 | ₹50.00 | ₹22.75 | ₹527.75 | PASS |
| `TC-04` | 220 | 175 + 400 + (70 × 5.20) = ₹939.00 | ₹50.00 | ₹46.95 | ₹1035.95 | PASS |
| `TC-05` | 350 | 175 + 400 + 520 + (100 × 6.50) = ₹1745.00 | ₹50.00 | ₹87.25 | ₹1882.25 | PASS |

---

## 6. CONCLUSION

Practical #1 was successfully implemented and verified. The website demonstrates:
1. Accurate server-side PHP business logic for multi-tier tariff calculations.
2. Seamless front-end responsiveness via Bootstrap 5 and jQuery AJAX.
3. Effective use of AI prompt engineering for full-stack code generation.
