<?php
/**
 * Practical 1: Responsive Electricity Bill Calculator using PHP, Bootstrap, and jQuery
 * Course: Web Technologies
 * 
 * Tariff Slabs (Strict Assignment Specification):
 * - First 50 units (0 - 50): Rs. 3.50 / unit
 * - Next 100 units (51 - 150): Rs. 4.00 / unit
 * - Next 100 units (151 - 250): Rs. 5.20 / unit
 * - Above 250 units (> 250): Rs. 6.50 / unit
 */

require_once __DIR__ . '/calculate.php';

// Server-side PHP Form Submission Handler
$serverResult = null;
$inputConsumerName = "John Doe";
$inputConsumerNo = "ELE-889102";
$inputBillingMonth = date('F Y');
$inputUnits = 185; // Default demo value

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['units'])) {
    $inputConsumerName = isset($_POST['consumerName']) ? htmlspecialchars($_POST['consumerName']) : 'Valued Consumer';
    $inputConsumerNo = isset($_POST['consumerNo']) ? htmlspecialchars($_POST['consumerNo']) : 'ELE-999999';
    $inputBillingMonth = isset($_POST['billingMonth']) ? htmlspecialchars($_POST['billingMonth']) : date('F Y');
    $inputUnits = floatval($_POST['units']);
    
    $serverResult = calculateElectricityBill($inputUnits);
} else {
    // Default initial calculation
    $serverResult = calculateElectricityBill($inputUnits);
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerCalc Pro | Electricity Bill Calculator (PHP + Bootstrap + jQuery)</title>
    <meta name="description" content="Responsive PHP Electricity Bill Calculator with Tariff Slabs breakdown, appliance estimator, and ChatGPT prompt documentation.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Custom Glassmorphic Stylesheet -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Main Navigation Bar -->
    <nav class="navbar navbar-expand-lg sticky-top border-bottom border-secondary border-opacity-25" style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px);">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" href="index.php">
                <div class="rounded-3 bg-gradient p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: linear-gradient(135deg, #38bdf8, #6366f1);">
                    <i class="fas fa-bolt text-white"></i>
                </div>
                <span>PowerCalc <span style="color: #38bdf8;">Pro</span></span>
            </a>
            
            <div class="d-flex align-items-center gap-3">
                <span class="badge bg-secondary bg-opacity-25 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill d-none d-sm-inline-block">
                    <i class="fas fa-code me-1"></i> PHP Practical #1
                </span>
                <button id="themeToggle" class="btn btn-sm btn-outline-light rounded-pill px-3">
                    <i class="fas fa-sun me-1"></i> Light Mode
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Application Container -->
    <div class="container mt-4">
        
        <!-- Header Banner -->
        <header class="app-header text-center position-relative">
            <div class="brand-badge">
                <i class="fas fa-sparkles"></i> AI-Generated & PHP Powered Utility
            </div>
            <h1 class="fw-extrabold display-5 mb-2">Smart Electricity Bill Calculator</h1>
            <p class="text-secondary mx-auto" style="max-width: 650px;">
                Calculate monthly electricity billing with automated multi-slab tariff breakdown, energy taxes, dynamic live unit estimations, and full PDF invoice export.
            </p>

            <!-- Navigation Tabs -->
            <ul class="nav nav-pills justify-content-center gap-2 mt-4" id="mainTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="pills-calculator-tab" data-bs-toggle="pill" data-bs-target="#pills-calculator" type="button" role="tab">
                        <i class="fas fa-calculator me-1"></i> Bill Calculator
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-tariffs-tab" data-bs-toggle="pill" data-bs-target="#pills-tariffs" type="button" role="tab">
                        <i class="fas fa-list-ol me-1"></i> Tariff Schedule
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-estimator-tab" data-bs-toggle="pill" data-bs-target="#pills-estimator" type="button" role="tab">
                        <i class="fas fa-plug me-1"></i> Appliance Estimator
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-ai-tab" data-bs-toggle="pill" data-bs-target="#pills-ai" type="button" role="tab">
                        <i class="fas fa-robot me-1"></i> AI Prompt Prompts & Docs
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab">
                        <i class="fas fa-history me-1"></i> Calculation History
                    </button>
                </li>
            </ul>
        </header>

        <!-- Tab Contents -->
        <div class="tab-content" id="mainTabsContent">
            
            <!-- TAB 1: BILL CALCULATOR -->
            <div class="tab-pane fade show active" id="pills-calculator" role="tabpanel">
                <div class="row g-4">
                    
                    <!-- Left Form Column -->
                    <div class="col-lg-6">
                        <div class="glass-card p-4 h-100">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <i class="fas fa-sliders-h text-info"></i> Consumer & Unit Inputs
                            </h3>

                            <form id="billCalcForm" action="index.php" method="POST">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="consumerName" class="form-label">Consumer Name</label>
                                        <input type="text" class="form-control" id="consumerName" name="consumerName" value="<?php echo htmlspecialchars($inputConsumerName); ?>" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="consumerNo" class="form-label">Meter Account / ID</label>
                                        <input type="text" class="form-control" id="consumerNo" name="consumerNo" value="<?php echo htmlspecialchars($inputConsumerNo); ?>" required>
                                    </div>
                                </div>

                                <div class="row g-3 mt-1">
                                    <div class="col-md-6">
                                        <label for="billingMonth" class="form-label">Billing Month</label>
                                        <input type="month" class="form-control" id="billingMonth" name="billingMonth" value="<?php echo date('Y-m'); ?>">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="connectionType" class="form-label">Connection Type</label>
                                        <select class="form-select" id="connectionType">
                                            <option value="residential" selected>Domestic / Residential</option>
                                            <option value="commercial">Commercial / General</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Dynamic Units Slider Box -->
                                <div class="mt-4 p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <label for="unitsInput" class="form-label mb-0 fw-bold">Consumed Electricity Units (kWh)</label>
                                        <span class="badge bg-info text-dark">Live jQuery Sync</span>
                                    </div>

                                    <div class="input-group input-group-lg mb-3">
                                        <span class="input-group-text bg-secondary bg-opacity-25 text-white border-secondary border-opacity-25">
                                            <i class="fas fa-tachometer-alt text-info"></i>
                                        </span>
                                        <input type="number" class="form-control fw-bold fs-4 text-info" id="unitsInput" name="units" min="0" max="2000" step="1" value="<?php echo $inputUnits; ?>" required>
                                        <span class="input-group-text bg-secondary bg-opacity-25 text-white border-secondary border-opacity-25">Units</span>
                                    </div>

                                    <input type="range" class="form-range custom-range" id="unitsRange" min="0" max="1000" step="5" value="<?php echo $inputUnits; ?>">
                                    
                                    <div class="d-flex justify-content-between text-secondary small">
                                        <span>0 Units</span>
                                        <span>250 Units</span>
                                        <span>500 Units</span>
                                        <span>1000+ Units</span>
                                    </div>
                                </div>

                                <!-- Form Buttons -->
                                <div class="d-flex gap-3 mt-4">
                                    <button type="submit" id="btnCalculate" class="btn btn-info text-dark fw-bold flex-grow-1 py-3 rounded-3 shadow">
                                        <i class="fas fa-calculator me-2"></i> Calculate Bill (PHP / AJAX)
                                    </button>
                                    <button type="reset" class="btn btn-outline-secondary px-3 py-3 rounded-3">
                                        <i class="fas fa-redo"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Right Results Column -->
                    <div class="col-lg-6">
                        <div class="glass-card p-4 h-100 d-flex flexDirection-column justify-content-between">
                            <div>
                                <!-- Total Spotlight -->
                                <div class="bill-hero-card mb-4">
                                    <span class="text-uppercase tracking-wider text-secondary small fw-bold">Estimated Grand Total</span>
                                    <div class="bill-amount-grand my-1" id="dispGrandTotal">
                                        ₹<?php echo number_format($serverResult['grandTotal'], 2); ?>
                                    </div>
                                    <div class="d-flex justify-content-center gap-3 text-secondary small mt-2">
                                        <span>Energy: <strong id="dispEnergyCharges" class="text-light">₹<?php echo number_format($serverResult['totalEnergyCharges'], 2); ?></strong></span>
                                        <span>•</span>
                                        <span>Fixed: <strong id="dispFixedCharge" class="text-light">₹<?php echo number_format($serverResult['fixedCharge'], 2); ?></strong></span>
                                        <span>•</span>
                                        <span>Duty (5%): <strong id="dispGovTax" class="text-light">₹<?php echo number_format($serverResult['govTax'], 2); ?></strong></span>
                                    </div>
                                </div>

                                <!-- Slab Progress Bar -->
                                <div class="mb-4">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-secondary fw-bold">Cost Distribution Breakdown</span>
                                        <span class="small text-info fw-bold"><span id="liveUnitsDisplay"><?php echo $serverResult['units']; ?></span> kWh Consumed</span>
                                    </div>
                                    <div class="slab-progress-container">
                                        <div id="barSlab1" class="slab-progress-bar bg-slab1" style="width: <?php echo $serverResult['slabs']['slab1']['percentage']; ?>%;"></div>
                                        <div id="barSlab2" class="slab-progress-bar bg-slab2" style="width: <?php echo $serverResult['slabs']['slab2']['percentage']; ?>%;"></div>
                                        <div id="barSlab3" class="slab-progress-bar bg-slab3" style="width: <?php echo $serverResult['slabs']['slab3']['percentage']; ?>%;"></div>
                                        <div id="barSlab4" class="slab-progress-bar bg-slab4" style="width: <?php echo $serverResult['slabs']['slab4']['percentage']; ?>%;"></div>
                                    </div>
                                </div>

                                <!-- 4 Slab Cards Grid -->
                                <div class="row g-2 mb-4">
                                    <!-- Slab 1 -->
                                    <div class="col-6 col-sm-3">
                                        <div class="slab-card slab-1 <?php echo ($serverResult['activeSlab'] == 1 && $serverResult['units'] > 0) ? 'active-slab' : ''; ?>" id="slabCard1">
                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                <span class="slab-badge">Slab 1</span>
                                                <small class="text-secondary">0-50</small>
                                            </div>
                                            <div class="fw-bold fs-6">₹3.50/u</div>
                                            <div class="small text-secondary"><span id="s1Units"><?php echo $serverResult['slabs']['slab1']['units']; ?></span> u</div>
                                            <div class="fw-bold text-success mt-1" id="s1Cost">₹<?php echo number_format($serverResult['slabs']['slab1']['cost'], 2); ?></div>
                                        </div>
                                    </div>

                                    <!-- Slab 2 -->
                                    <div class="col-6 col-sm-3">
                                        <div class="slab-card slab-2 <?php echo ($serverResult['activeSlab'] == 2) ? 'active-slab' : ''; ?>" id="slabCard2">
                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                <span class="slab-badge">Slab 2</span>
                                                <small class="text-secondary">51-150</small>
                                            </div>
                                            <div class="fw-bold fs-6">₹4.00/u</div>
                                            <div class="small text-secondary"><span id="s2Units"><?php echo $serverResult['slabs']['slab2']['units']; ?></span> u</div>
                                            <div class="fw-bold text-info mt-1" id="s2Cost">₹<?php echo number_format($serverResult['slabs']['slab2']['cost'], 2); ?></div>
                                        </div>
                                    </div>

                                    <!-- Slab 3 -->
                                    <div class="col-6 col-sm-3">
                                        <div class="slab-card slab-3 <?php echo ($serverResult['activeSlab'] == 3) ? 'active-slab' : ''; ?>" id="slabCard3">
                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                <span class="slab-badge">Slab 3</span>
                                                <small class="text-secondary">151-250</small>
                                            </div>
                                            <div class="fw-bold fs-6">₹5.20/u</div>
                                            <div class="small text-secondary"><span id="s3Units"><?php echo $serverResult['slabs']['slab3']['units']; ?></span> u</div>
                                            <div class="fw-bold text-warning mt-1" id="s3Cost">₹<?php echo number_format($serverResult['slabs']['slab3']['cost'], 2); ?></div>
                                        </div>
                                    </div>

                                    <!-- Slab 4 -->
                                    <div class="col-6 col-sm-3">
                                        <div class="slab-card slab-4 <?php echo ($serverResult['activeSlab'] == 4) ? 'active-slab' : ''; ?>" id="slabCard4">
                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                <span class="slab-badge">Slab 4</span>
                                                <small class="text-secondary">>250</small>
                                            </div>
                                            <div class="fw-bold fs-6">₹6.50/u</div>
                                            <div class="small text-secondary"><span id="s4Units"><?php echo $serverResult['slabs']['slab4']['units']; ?></span> u</div>
                                            <div class="fw-bold text-danger mt-1" id="s4Cost">₹<?php echo number_format($serverResult['slabs']['slab4']['cost'], 2); ?></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Footer -->
                            <div class="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                                <span class="small text-secondary"><i class="fas fa-info-circle me-1"></i> Includes fixed meter charges & 5% duty</span>
                                <button class="btn btn-outline-info rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#invoiceModal">
                                    <i class="fas fa-file-invoice me-2"></i> View Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- TAB 2: TARIFF SCHEDULE -->
            <div class="tab-pane fade" id="pills-tariffs" role="tabpanel">
                <div class="glass-card p-4">
                    <h3 class="h5 fw-bold mb-3"><i class="fas fa-table text-info me-2"></i> Standard Electricity Tariff Slabs</h3>
                    <p class="text-secondary">Strict tariff schedule specified in Assignment Practical 1 conditions:</p>
                    
                    <div class="table-responsive">
                        <table class="table table-dark table-hover align-middle rounded-3 overflow-hidden">
                            <thead class="table-secondary">
                                <tr>
                                    <th>Slab Tier</th>
                                    <th>Unit Range (kWh)</th>
                                    <th>Rate per Unit (₹)</th>
                                    <th>Max Slab Capacity</th>
                                    <th>Max Slab Charge (₹)</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="badge bg-slab1">Tier 1</span></td>
                                    <td class="fw-bold">First 50 Units</td>
                                    <td class="text-success fw-bold">₹ 3.50</td>
                                    <td>50 Units</td>
                                    <td>₹ 175.00</td>
                                    <td>Lifeline / Basic domestic consumption rate</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-slab2">Tier 2</span></td>
                                    <td class="fw-bold">Next 100 Units (51 - 150)</td>
                                    <td class="text-info fw-bold">₹ 4.00</td>
                                    <td>100 Units</td>
                                    <td>₹ 400.00</td>
                                    <td>Moderate domestic household tier</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-slab3">Tier 3</span></td>
                                    <td class="fw-bold">Next 100 Units (151 - 250)</td>
                                    <td class="text-warning fw-bold">₹ 5.20</td>
                                    <td>100 Units</td>
                                    <td>₹ 520.00</td>
                                    <td>Upper domestic energy slab</td>
                                </tr>
                                <tr>
                                    <td><span class="badge bg-slab4">Tier 4</span></td>
                                    <td class="fw-bold">Above 250 Units (> 250)</td>
                                    <td class="text-danger fw-bold">₹ 6.50</td>
                                    <td>Unlimited</td>
                                    <td>Variable</td>
                                    <td>High-demand residential / heavy appliance tier</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- TAB 3: APPLIANCE ESTIMATOR -->
            <div class="tab-pane fade" id="pills-estimator" role="tabpanel">
                <div class="glass-card p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h3 class="h5 fw-bold mb-1"><i class="fas fa-plug text-info me-2"></i> Household Appliance Consumption Estimator</h3>
                            <p class="text-secondary small mb-0">Estimate your total monthly units based on household device usage before calculating bill.</p>
                        </div>
                        <button class="btn btn-sm btn-info text-dark fw-bold" id="btnAddAppliance">
                            <i class="fas fa-plus me-1"></i> Add Device
                        </button>
                    </div>

                    <div class="table-responsive mb-3">
                        <table class="table table-dark align-middle appliance-table">
                            <thead>
                                <tr class="text-secondary">
                                    <th>Appliance</th>
                                    <th>Power (Watts)</th>
                                    <th>Qty</th>
                                    <th>Hours / Day</th>
                                    <th class="text-end">Est. Monthly (kWh)</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="applianceTableBody">
                                <tr class="appliance-row">
                                    <td><input type="text" class="form-control form-control-sm app-name" value="LED Air Conditioner (1.5 Ton)"></td>
                                    <td><input type="number" class="form-control form-control-sm app-watts" value="1500" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-qty" value="1" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-hours" value="6" min="0" max="24"></td>
                                    <td class="text-end fw-bold app-units text-info">270.0</td>
                                    <td class="text-center"><button class="btn btn-sm btn-outline-danger btn-remove-app"><i class="fas fa-trash"></i></button></td>
                                </tr>
                                <tr class="appliance-row">
                                    <td><input type="text" class="form-control form-control-sm app-name" value="Refrigerator"></td>
                                    <td><input type="number" class="form-control form-control-sm app-watts" value="250" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-qty" value="1" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-hours" value="24" min="0" max="24"></td>
                                    <td class="text-end fw-bold app-units text-info">180.0</td>
                                    <td class="text-center"><button class="btn btn-sm btn-outline-danger btn-remove-app"><i class="fas fa-trash"></i></button></td>
                                </tr>
                                <tr class="appliance-row">
                                    <td><input type="text" class="form-control form-control-sm app-name" value="Ceiling Fans"></td>
                                    <td><input type="number" class="form-control form-control-sm app-watts" value="75" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-qty" value="3" min="1"></td>
                                    <td><input type="number" class="form-control form-control-sm app-hours" value="12" min="0" max="24"></td>
                                    <td class="text-end fw-bold app-units text-info">81.0</td>
                                    <td class="text-center"><button class="btn btn-sm btn-outline-danger btn-remove-app"><i class="fas fa-trash"></i></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="d-flex justify-content-between align-items-center p-3 rounded-3 bg-dark">
                        <div>
                            <span class="text-secondary small">Total Estimated Units:</span>
                            <span class="fs-4 fw-bold text-info ms-2" id="estimatedApplianceUnits">531</span> kWh
                        </div>
                        <button class="btn btn-success fw-bold" id="btnApplyEstimatedUnits">
                            <i class="fas fa-check-circle me-1"></i> Load Units into Calculator
                        </button>
                    </div>
                </div>
            </div>

            <!-- TAB 4: AI PROMPTS & DOCUMENTATION -->
            <div class="tab-pane fade" id="pills-ai" role="tabpanel">
                <div class="glass-card p-4">
                    <h3 class="h5 fw-bold mb-3"><i class="fas fa-robot text-info me-2"></i> AI Code Generation Workflow & Prompts</h3>
                    <p class="text-secondary">This application was developed using AI Code Generation tools (ChatGPT / Gemini). Below are the engineered prompts used to build the core modules:</p>

                    <div class="accordion accordion-flush" id="promptAccordion">
                        <!-- Prompt 1 -->
                        <div class="accordion-item bg-transparent text-light border-secondary">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed bg-dark text-info fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#prompt1">
                                    Prompt 1: PHP Slab Calculation Backend & Business Logic
                                </button>
                            </h2>
                            <div id="prompt1" class="accordion-collapse collapse show" data-bs-parent="#promptAccordion">
                                <div class="accordion-body">
                                    <button class="btn btn-sm btn-outline-light float-end btn-copy-prompt"><i class="fas fa-copy me-1"></i> Copy Prompt</button>
                                    <div class="ai-prompt-box">Write a clean PHP function `calculateElectricityBill($units)` that calculates total charges based on slab conditions:
- First 50 units: Rs. 3.50/unit
- Next 100 units (51-150): Rs. 4.00/unit
- Next 100 units (151-250): Rs. 5.20/unit
- Units above 250: Rs. 6.50/unit
Return itemized array with units, cost per slab, total energy charges, fixed service charge, 5% electricity duty tax, and grand total. Support both PHP POST submission and AJAX JSON API responses.</div>
                                </div>
                            </div>
                        </div>

                        <!-- Prompt 2 -->
                        <div class="accordion-item bg-transparent text-light border-secondary">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed bg-dark text-info fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#prompt2">
                                    Prompt 2: Responsive Bootstrap 5 UI & Glassmorphism Theme
                                </button>
                            </h2>
                            <div id="prompt2" class="accordion-collapse collapse" data-bs-parent="#promptAccordion">
                                <div class="accordion-body">
                                    <button class="btn btn-sm btn-outline-light float-end btn-copy-prompt"><i class="fas fa-copy me-1"></i> Copy Prompt</button>
                                    <div class="ai-prompt-box">Design a modern glassmorphic dashboard UI using Bootstrap 5 and FontAwesome for an electricity bill calculator. Include:
1. Header with dark/light mode toggle.
2. Dual-input unit controls (HTML5 range slider + numeric input synced with jQuery).
3. 4 visual slab cards highlighting active slab.
4. Animated progress bar showing cost percentage contribution of each slab.
5. Printable invoice modal with itemized tariff table.</div>
                                </div>
                            </div>
                        </div>

                        <!-- Prompt 3 -->
                        <div class="accordion-item bg-transparent text-light border-secondary">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed bg-dark text-info fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#prompt3">
                                    Prompt 3: Interactive jQuery Live Sync & AJAX Handler
                                </button>
                            </h2>
                            <div id="prompt3" class="accordion-collapse collapse" data-bs-parent="#promptAccordion">
                                <div class="accordion-body">
                                    <button class="btn btn-sm btn-outline-light float-end btn-copy-prompt"><i class="fas fa-copy me-1"></i> Copy Prompt</button>
                                    <div class="ai-prompt-box">Write jQuery script to handle:
1. Real-time synchronous calculation preview as the unit range slider moves.
2. Form AJAX POST to `calculate.php` without full page refresh.
3. Appliance consumption estimator adding up device Watts * Qty * Hours / 1000.
4. LocalStorage calculation history array saving last 10 invoices.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 5: CALCULATION HISTORY -->
            <div class="tab-pane fade" id="pills-history" role="tabpanel">
                <div class="glass-card p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="h5 fw-bold mb-0"><i class="fas fa-history text-info me-2"></i> Saved Invoices & Calculation History</h3>
                        <button class="btn btn-sm btn-outline-danger" id="btnClearHistory">
                            <i class="fas fa-trash me-1"></i> Clear History
                        </button>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover align-middle">
                            <thead>
                                <tr class="text-secondary">
                                    <th>Date</th>
                                    <th>Consumer Details</th>
                                    <th>Billing Month</th>
                                    <th>Units Consumed</th>
                                    <th>Grand Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody id="historyTableBody">
                                <!-- Populated dynamically by jQuery app.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Printable Invoice Modal -->
    <div class="modal fade" id="invoiceModal" tabindex="-1" aria-labelledby="invoiceModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content bg-dark text-light border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title fw-bold" id="invoiceModalLabel">
                        <i class="fas fa-file-invoice text-info me-2"></i> Official Electricity Bill Statement
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4 printable-invoice">
                    <!-- Invoice Header -->
                    <div class="d-flex justify-content-between border-bottom border-secondary pb-3 mb-3">
                        <div>
                            <h4 class="fw-bold text-info mb-1">State Electricity Board</h4>
                            <p class="small text-secondary mb-0">Utility Distribution & Billing Services</p>
                        </div>
                        <div class="text-end">
                            <div class="badge bg-success mb-1">Status: Paid / Verified</div>
                            <div class="small text-secondary">Date: <span id="invDate"><?php echo date('d/m/Y'); ?></span></div>
                        </div>
                    </div>

                    <!-- Customer Metadata -->
                    <div class="row g-3 mb-4">
                        <div class="col-6">
                            <small class="text-secondary d-block">Consumer Name:</small>
                            <strong id="invName"><?php echo htmlspecialchars($inputConsumerName); ?></strong>
                        </div>
                        <div class="col-6 text-end">
                            <small class="text-secondary d-block">Account / Meter No:</small>
                            <strong id="invAccNo"><?php echo htmlspecialchars($inputConsumerNo); ?></strong>
                        </div>
                        <div class="col-6">
                            <small class="text-secondary d-block">Billing Period:</small>
                            <strong id="invMonth"><?php echo htmlspecialchars($inputBillingMonth); ?></strong>
                        </div>
                        <div class="col-6 text-end">
                            <small class="text-secondary d-block">Total Consumption:</small>
                            <strong class="text-info" id="invUnits"><?php echo $serverResult['units']; ?></strong> kWh
                        </div>
                    </div>

                    <!-- Invoice Itemized Table -->
                    <div class="table-responsive">
                        <table class="table table-dark table-bordered align-middle">
                            <thead class="table-secondary">
                                <tr>
                                    <th>Description / Tariff Slab</th>
                                    <th class="text-center">Units</th>
                                    <th class="text-end">Rate (₹)</th>
                                    <th class="text-end">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody id="invTableBody">
                                <tr>
                                    <td>First 50 Units (0-50 @ ₹3.50/unit)</td>
                                    <td class="text-center"><?php echo $serverResult['slabs']['slab1']['units']; ?></td>
                                    <td class="text-end">₹3.50</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['slabs']['slab1']['cost'], 2); ?></td>
                                </tr>
                                <tr>
                                    <td>Next 100 Units (51-150 @ ₹4.00/unit)</td>
                                    <td class="text-center"><?php echo $serverResult['slabs']['slab2']['units']; ?></td>
                                    <td class="text-end">₹4.00</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['slabs']['slab2']['cost'], 2); ?></td>
                                </tr>
                                <tr>
                                    <td>Next 100 Units (151-250 @ ₹5.20/unit)</td>
                                    <td class="text-center"><?php echo $serverResult['slabs']['slab3']['units']; ?></td>
                                    <td class="text-end">₹5.20</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['slabs']['slab3']['cost'], 2); ?></td>
                                </tr>
                                <tr>
                                    <td>Above 250 Units (>250 @ ₹6.50/unit)</td>
                                    <td class="text-center"><?php echo $serverResult['slabs']['slab4']['units']; ?></td>
                                    <td class="text-end">₹6.50</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['slabs']['slab4']['cost'], 2); ?></td>
                                </tr>
                                <tr class="table-active">
                                    <th colspan="3">Total Energy Charges</th>
                                    <th class="text-end">₹<?php echo number_format($serverResult['totalEnergyCharges'], 2); ?></th>
                                </tr>
                                <tr>
                                    <td colspan="3">Fixed Meter Service Charge</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['fixedCharge'], 2); ?></td>
                                </tr>
                                <tr>
                                    <td colspan="3">State Electricity Duty (5%)</td>
                                    <td class="text-end">₹<?php echo number_format($serverResult['govTax'], 2); ?></td>
                                </tr>
                                <tr class="table-primary fw-bold fs-5">
                                    <td colspan="3">Grand Payable Amount</td>
                                    <td class="text-end text-primary" id="invGrandTotal">₹<?php echo number_format($serverResult['grandTotal'], 2); ?></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-info fw-bold" id="btnPrintInvoice">
                        <i class="fas fa-print me-1"></i> Print / Save PDF
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>