<?php
/**
 * Electricity Bill Calculation Backend Module
 * Practical 1: Responsive PHP Electricity Bill Calculator
 * 
 * Tariff Slabs:
 * - First 50 units (0 - 50): Rs. 3.50 / unit
 * - Next 100 units (51 - 150): Rs. 4.00 / unit
 * - Next 100 units (151 - 250): Rs. 5.20 / unit
 * - Above 250 units (> 250): Rs. 6.50 / unit
 */

/**
 * Calculates itemized electricity bill breakdown based on consumed units
 * 
 * @param float|int $units Number of electricity units consumed
 * @return array Itemized slab breakdown, totals, and meta details
 */
function calculateElectricityBill($units) {
    $units = max(0, floatval($units));
    
    $slab1_rate = 3.50;
    $slab2_rate = 4.00;
    $slab3_rate = 5.20;
    $slab4_rate = 6.50;

    $remainingUnits = $units;

    // Slab 1: First 50 units @ Rs. 3.50
    $slab1_units = min($remainingUnits, 50);
    $slab1_cost = $slab1_units * $slab1_rate;
    $remainingUnits -= $slab1_units;

    // Slab 2: Next 100 units (51 to 150) @ Rs. 4.00
    $slab2_units = min($remainingUnits, 100);
    $slab2_cost = $slab2_units * $slab2_rate;
    $remainingUnits -= $slab2_units;

    // Slab 3: Next 100 units (151 to 250) @ Rs. 5.20
    $slab3_units = min($remainingUnits, 100);
    $slab3_cost = $slab3_units * $slab3_rate;
    $remainingUnits -= $slab3_units;

    // Slab 4: Above 250 units @ Rs. 6.50
    $slab4_units = max($remainingUnits, 0);
    $slab4_cost = $slab4_units * $slab4_rate;

    $totalEnergyCharges = $slab1_cost + $slab2_cost + $slab3_cost + $slab4_cost;
    
    // Optional Fixed Meter Charge & Government Duty (standard utility formatting)
    $fixedCharge = ($units > 0) ? 50.00 : 0.00;
    $govTaxRate = 0.05; // 5% Electricity Duty
    $govTax = $totalEnergyCharges * $govTaxRate;
    $grandTotal = $totalEnergyCharges + $fixedCharge + $govTax;

    // Active highest slab index
    $activeSlab = 1;
    if ($units > 250) {
        $activeSlab = 4;
    } else if ($units > 150) {
        $activeSlab = 3;
    } else if ($units > 50) {
        $activeSlab = 2;
    }

    return [
        'units' => $units,
        'totalEnergyCharges' => round($totalEnergyCharges, 2),
        'fixedCharge' => round($fixedCharge, 2),
        'govTax' => round($govTax, 2),
        'grandTotal' => round($grandTotal, 2),
        'activeSlab' => $activeSlab,
        'effectiveRate' => ($units > 0) ? round($grandTotal / $units, 2) : 0,
        'slabs' => [
            'slab1' => [
                'name' => 'First 50 Units',
                'range' => '0 - 50',
                'units' => round($slab1_units, 2),
                'rate' => $slab1_rate,
                'cost' => round($slab1_cost, 2),
                'percentage' => ($totalEnergyCharges > 0) ? round(($slab1_cost / $totalEnergyCharges) * 100, 1) : 0
            ],
            'slab2' => [
                'name' => 'Next 100 Units',
                'range' => '51 - 150',
                'units' => round($slab2_units, 2),
                'rate' => $slab2_rate,
                'cost' => round($slab2_cost, 2),
                'percentage' => ($totalEnergyCharges > 0) ? round(($slab2_cost / $totalEnergyCharges) * 100, 1) : 0
            ],
            'slab3' => [
                'name' => 'Next 100 Units',
                'range' => '151 - 250',
                'units' => round($slab3_units, 2),
                'rate' => $slab3_rate,
                'cost' => round($slab3_cost, 2),
                'percentage' => ($totalEnergyCharges > 0) ? round(($slab3_cost / $totalEnergyCharges) * 100, 1) : 0
            ],
            'slab4' => [
                'name' => 'Above 250 Units',
                'range' => '> 250',
                'units' => round($slab4_units, 2),
                'rate' => $slab4_rate,
                'cost' => round($slab4_cost, 2),
                'percentage' => ($totalEnergyCharges > 0) ? round(($slab4_cost / $totalEnergyCharges) * 100, 1) : 0
            ]
        ]
    ];
}

// Handle Direct AJAX API Requests
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest' || isset($_GET['action']) && $_GET['action'] === 'ajax_calc') {
    header('Content-Type: application/json');
    $units = isset($_REQUEST['units']) ? floatval($_REQUEST['units']) : 0;
    $result = calculateElectricityBill($units);
    echo json_encode(['status' => 'success', 'data' => $result]);
    exit;
}
