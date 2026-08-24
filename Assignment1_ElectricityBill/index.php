<?php
/**
 * Practical 1: Minimalist PHP Electricity Bill Calculator
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
    <title>[POWER BOARD] | Electricity Bill Calculator</title>
    <meta name="description" content="Minimalist PHP Electricity Bill Calculator with Tariff Slabs breakdown, appliance estimator, and ChatGPT prompt documentation.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 CSS & FontAwesome -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Minimalist Stylesheet -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Header Section -->
    <header class="brand-header">
        <div class="container d-flex justify-content-between align-items-center">
            <div>
                <h1 class="brand-title">[POWER BOARD]</h1>
                <div class="bracket-tag mt-1">[PRACTICAL 1: PHP ELECTRICITY BILL CALCULATOR]</div>
            </div>
            <div class="d-flex align-items-center gap-3">
                <button id="themeToggle" class="btn-minimal btn-minimal-outline py-2 px-3">
                    [THEME MODE]
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container mt-4">

        <!-- Navigation Tabs -->
        <ul class="nav nav-tabs-minimal nav-fill" id="mainTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link active" id="pills-calculator-tab" data-bs-toggle="tab" data-bs-target="#pills-calculator" type="button" role="tab">
                    [BILL CALCULATOR]
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="pills-tariffs-tab" data-bs-toggle="tab" data-bs-target="#pills-tariffs" type="button" role="tab">
                    [TARIFF SCHEDULE]
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="pills-estimator-tab" data-bs-toggle="tab" data-bs-target="#pills-estimator" type="button" role="tab">
                    [APPLIANCE ESTIMATOR]
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="pills-ai-tab" data-bs-toggle="tab" data-bs-target="#pills-ai" type="button" role="tab">
                    [AI PROMPTS]
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="pills-history-tab" data-bs-toggle="tab" data-bs-target="#pills-history" type="button" role="tab">
                    [HISTORY]
                </button>
            </li>
        </ul>

        <!-- Tab Contents -->
        <div class="tab-content" id="mainTabsContent">

            <!-- TAB 1: BILL CALCULATOR -->
            <div class="tab-pane fade show active" id="pills-calculator" role="tabpanel">
                <div class="row g-4">

                    <!-- Left Input Column -->
                    <div class="col-lg-6">
                        <div class="minimal-card">
                            <div class="bracket-tag mb-3">[CONSUMER METADATA & INPUTS]</div>

                            <form id="billCalcForm" action="index.php" method="POST">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label-minimal">[CONSUMER NAME]</label>
                                        <input type="text" class="form-control-minimal" id="consumerName" name="consumerName" value="<?php echo htmlspecialchars($inputConsumerName); ?>" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label-minimal">[ACCOUNT / METER ID]</label>
                                        <input type="text" class="form-control-minimal" id="consumerNo" name="consumerNo" value="<?php echo htmlspecialchars($inputConsumerNo); ?>" required>
                                    </div>
                                </div>

                                <div class="row g-3 mt-1">
                                    <div class="col-md-6">
                                        <label class="form-label-minimal">[BILLING PERIOD]</label>
                                        <input type="month" class="form-control-minimal" id="billingMonth" name="billingMonth" value="<?php echo date('Y-m'); ?>">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label-minimal">[CATEGORY]</label>
                                        <select class="form-select-minimal" id="connectionType">
                                            <option value="residential" selected>DOMESTIC / RESIDENTIAL</option>
                                            <option value="commercial">COMMERCIAL / GENERAL</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Units Slider Box -->
                                <div class="mt-4 p-3 border border-secondary">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <label class="form-label-minimal mb-0">[CONSUMED ELECTRICITY UNITS (KWH)]</label>
                                        <span class="badge bg-secondary font-monospace">JQUERY LIVE</span>
                                    </div>

                                    <div class="input-group mb-3">
                                        <input type="number" class="form-control-minimal fs-3 fw-bold font-monospace" id="unitsInput" name="units" min="0" max="2000" step="1" value="<?php echo $inputUnits; ?>" required>
                                    </div>

                                    <input type="range" class="minimal-range" id="unitsRange" min="0" max="1000" step="5" value="<?php echo $inputUnits; ?>">

                                    <div class="d-flex justify-content-between bracket-tag mt-2">
                                        <span>0 UNITS</span>
                                        <span>250 UNITS</span>
                                        <span>500 UNITS</span>
                                        <span>1000+ UNITS</span>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <button type="submit" id="btnCalculate" class="btn-minimal w-100 py-3">
                                        [CALCULATE BILL (PHP / AJAX)]
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Right Calculation Result Column -->
                    <div class="col-lg-6">
                        <div class="minimal-card d-flex flex-column justify-content-between">
                            <div>
                                <!-- Total Spotlight Banner -->
                                <div class="grand-banner">
                                    <div class="grand-label">[ESTIMATED GRAND TOTAL]</div>
                                    <div class="grand-value" id="dispGrandTotal">
                                        ₹<?php echo number_format($serverResult['grandTotal'], 2); ?>
                                    </div>
                                    <div class="bracket-tag mt-2">
                                        ENERGY: <span id="dispEnergyCharges" class="text-white fw-bold">₹<?php echo number_format($serverResult['totalEnergyCharges'], 2); ?></span> | 
                                        FIXED: <span id="dispFixedCharge" class="text-white fw-bold">₹<?php echo number_format($serverResult['fixedCharge'], 2); ?></span> | 
                                        DUTY (5%): <span id="dispGovTax" class="text-white fw-bold">₹<?php echo number_format($serverResult['govTax'], 2); ?></span>
                                    </div>
                                </div>

                                <!-- Progress Bar -->
                                <div class="mb-4">
                                    <div class="d-flex justify-content-between bracket-tag mb-1">
                                        <span>[SLAB CONTRIBUTION BREAKDOWN]</span>
                                        <span><span id="liveUnitsDisplay"><?php echo $serverResult['units']; ?></span> KWH TOTAL</span>
                                    </div>
                                    <div class="progress-minimal-container">
                                        <div id="barSlab1" class="progress-minimal-bar bg-success" style="width: <?php echo $serverResult['slabs']['slab1']['percentage']; ?>%;"></div>
                                        <div id="barSlab2" class="progress-minimal-bar bg-primary" style="width: <?php echo $serverResult['slabs']['slab2']['percentage']; ?>%;"></div>
                                        <div id="barSlab3" class="progress-minimal-bar bg-warning" style="width: <?php echo $serverResult['slabs']['slab3']['percentage']; ?>%;"></div>
                                        <div id="barSlab4" class="progress-minimal-bar bg-danger" style="width: <?php echo $serverResult['slabs']['slab4']['percentage']; ?>%;"></div>
                                    </div>
                                </div>

                                <!-- Slab Cards Grid -->
                                <div class="slab-grid mb-4">
                                    <!-- Slab 1 -->
                                    <div class="slab-box <?php echo ($serverResult['activeSlab'] == 1 && $serverResult['units'] > 0) ? 'active-slab' : ''; ?>" id="slabCard1">
                                        <div class="slab-box-title">[SLAB 1] 0-50</div>
                                        <div class="slab-box-rate">₹3.50/u</div>
                                        <div class="slab-box-cost" id="s1Cost">₹<?php echo number_format($serverResult['slabs']['slab1']['cost'], 2); ?></div>
                                    </div>

                                    <!-- Slab 2 -->
                                    <div class="slab-box <?php echo ($serverResult['activeSlab'] == 2) ? 'active-slab' : ''; ?>" id="slabCard2">
                                        <div class="slab-box-title">[SLAB 2] 51-150</div>
                                        <div class="slab-box-rate">₹4.00/u</div>
                                        <div class="slab-box-cost" id="s2Cost">₹<?php echo number_format($serverResult['slabs']['slab2']['cost'], 2); ?></div>
                                    </div>

                                    <!-- Slab 3 -->
                                    <div class="slab-box <?php echo ($serverResult['activeSlab'] == 3) ? 'active-slab' : ''; ?>" id="slabCard3">
                                        <div class="slab-box-title">[SLAB 3] 151-250</div>
                                        <div class="slab-box-rate">₹5.20/u</div>
                                        <div class="slab-box-cost" id="s3Cost">₹<?php echo number_format($serverResult['slabs']['slab3']['cost'], 2); ?></div>
                                    </div>

                                    <!-- Slab 4 -->
                                    <div class="slab-box <?php echo ($serverResult['activeSlab'] == 4) ? 'active-slab' : ''; ?>" id="slabCard4">
                                        <div class="slab-box-title">[SLAB 4] >250</div>
                                        <div class="slab-box-rate">₹6.50/u</div>
                                        <div class="slab-box-cost" id="s4Cost">₹<?php echo number_format($serverResult['slabs']['slab4']['cost'], 2); ?></div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-3 border-top border-secondary">
                                <button class="btn-minimal btn-minimal-outline w-100" data-bs-toggle="modal" data-bs-target="#invoiceModal">
                                    [VIEW OFFICIAL STATEMENT / PRINT]
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- TAB 2: TARIFF SCHEDULE -->
            <div class="tab-pane fade" id="pills-tariffs" role="tabpanel">
                <div class="minimal-card">
                    <div class="bracket-tag mb-3">[OFFICIAL TARIFF SCHEDULE & SLAB STRUCTURE]</div>
                    
                    <table class="boring-table">
                        <thead>
                            <tr>
                                <th>TIER</th>
                                <th>UNIT RANGE (KWH)</th>
                                <th>RATE PER UNIT (₹)</th>
                                <th>MAX CAPACITY</th>
                                <th>DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>[SLAB 1]</td>
                                <td>0 - 50 UNITS</td>
                                <td>₹ 3.50</td>
                                <td>50 UNITS</td>
                                <td>Lifeline / Basic Domestic Consumption</td>
                            </tr>
                            <tr>
                                <td>[SLAB 2]</td>
                                <td>51 - 150 UNITS</td>
                                <td>₹ 4.00</td>
                                <td>100 UNITS</td>
                                <td>Standard Household Consumption</td>
                            </tr>
                            <tr>
                                <td>[SLAB 3]</td>
                                <td>151 - 250 UNITS</td>
                                <td>₹ 5.20</td>
                                <td>100 UNITS</td>
                                <td>Upper Domestic Consumption Slab</td>
                            </tr>
                            <tr>
                                <td>[SLAB 4]</td>
                                <td>ABOVE 250 UNITS</td>
                                <td>₹ 6.50</td>
                                <td>UNLIMITED</td>
                                <td>High-Demand Residential / Commercial Tier</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: APPLIANCE ESTIMATOR -->
            <div class="tab-pane fade" id="pills-estimator" role="tabpanel">
                <div class="minimal-card">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="bracket-tag">[HOUSEHOLD APPLIANCE CONSUMPTION ESTIMATOR]</div>
                        <button class="btn-minimal btn-minimal-outline py-2 px-3" id="btnAddAppliance">
                            [+ ADD DEVICE]
                        </button>
                    </div>

                    <table class="boring-table mb-4">
                        <thead>
                            <tr>
                                <th>APPLIANCE DEVICE</th>
                                <th>POWER (WATTS)</th>
                                <th>QTY</th>
                                <th>HOURS / DAY</th>
                                <th class="text-end">MONTHLY (KWH)</th>
                                <th class="text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="applianceTableBody">
                            <tr class="appliance-row">
                                <td><input type="text" class="form-control-minimal app-name" value="Air Conditioner (1.5 Ton)"></td>
                                <td><input type="number" class="form-control-minimal app-watts" value="1500" min="1"></td>
                                <td><input type="number" class="form-control-minimal app-qty" value="1" min="1"></td>
                                <td><input type="number" class="form-control-minimal app-hours" value="6" min="0" max="24"></td>
                                <td class="text-end fw-bold app-units">270.0</td>
                                <td class="text-center"><button class="btn-minimal btn-minimal-outline py-1 px-2 btn-remove-app">[X]</button></td>
                            </tr>
                            <tr class="appliance-row">
                                <td><input type="text" class="form-control-minimal app-name" value="Refrigerator"></td>
                                <td><input type="number" class="form-control-minimal app-watts" value="250" min="1"></td>
                                <td><input type="number" class="form-control-minimal app-qty" value="1" min="1"></td>
                                <td><input type="number" class="form-control-minimal app-hours" value="24" min="0" max="24"></td>
                                <td class="text-end fw-bold app-units">180.0</td>
                                <td class="text-center"><button class="btn-minimal btn-minimal-outline py-1 px-2 btn-remove-app">[X]</button></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="d-flex justify-content-between align-items-center p-3 border border-secondary">
                        <div class="bracket-tag">
                            ESTIMATED MONTHLY KWH: <span class="fs-4 fw-bold text-white ms-2" id="estimatedApplianceUnits">450</span> UNITS
                        </div>
                        <button class="btn-minimal py-2 px-4" id="btnApplyEstimatedUnits">
                            [LOAD UNITS INTO CALCULATOR]
                        </button>
                    </div>
                </div>
            </div>

            <!-- TAB 4: AI PROMPTS -->
            <div class="tab-pane fade" id="pills-ai" role="tabpanel">
                <div class="minimal-card">
                    <div class="bracket-tag mb-3">[ENGINEERED CHATGPT CODE GENERATION PROMPTS]</div>

                    <div class="mb-4">
                        <div class="fw-bold mb-2">[PROMPT 1: PHP BACKEND TARIFF CALCULATION ENGINE]</div>
                        <div class="prompt-code-block">Write a clean PHP function `calculateElectricityBill($units)` that calculates total charges based on slab conditions:
- First 50 units: Rs. 3.50/unit
- Next 100 units (51-150): Rs. 4.00/unit
- Next 100 units (151-250): Rs. 5.20/unit
- Units above 250: Rs. 6.50/unit
Return itemized array with units, cost per slab, total energy charges, fixed service charge, 5% electricity duty tax, and grand total. Support both PHP POST submission and AJAX JSON API responses.</div>
                    </div>

                    <div class="mb-4">
                        <div class="fw-bold mb-2">[PROMPT 2: MINIMALIST HIGH-CONTRAST MONOCHROME UI]</div>
                        <div class="prompt-code-block">Design a high-contrast minimalist utility dashboard inspired by brutalist typography. Include bracketed headers [TITLE], monochrome tabular layouts, real-time jQuery range slider sync, and printable statement invoice layout.</div>
                    </div>
                </div>
            </div>

            <!-- TAB 5: HISTORY -->
            <div class="tab-pane fade" id="pills-history" role="tabpanel">
                <div class="minimal-card">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="bracket-tag">[CALCULATION HISTORY LOG]</div>
                        <button class="btn-minimal btn-minimal-outline py-1 px-3" id="btnClearHistory">
                            [CLEAR LOG]
                        </button>
                    </div>

                    <table class="boring-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>CONSUMER DETAILS</th>
                                <th>PERIOD</th>
                                <th>UNITS</th>
                                <th class="text-end">AMOUNT (₹)</th>
                            </tr>
                        </thead>
                        <tbody id="historyTableBody">
                            <!-- Populated dynamically by app.js -->
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <!-- Official Statement Invoice Modal (Styled inspired by User Reference Image) -->
    <div class="modal fade boring-invoice-modal" id="invoiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="boring-invoice-body printable-invoice">
                    
                    <!-- Header inspired by [BORING STUDIOS] Reference Image -->
                    <div class="boring-invoice-header">
                        <div>
                            <h1 class="boring-brand">[POWER BOARD]</h1>
                        </div>
                        <div class="text-end">
                            <h2 class="boring-invoice-title">INVOICE</h2>
                        </div>
                    </div>

                    <!-- Meta Row -->
                    <div class="boring-meta-grid">
                        <div>
                            <div>[<span id="invDate"><?php echo date('jS F Y'); ?></span>]</div>
                            <div>[<span id="invName"><?php echo htmlspecialchars($inputConsumerName); ?></span>]</div>
                        </div>
                        <div>
                            <div>[#<span id="invAccNo"><?php echo htmlspecialchars($inputConsumerNo); ?></span>]</div>
                            <div>[<span id="invMonth"><?php echo htmlspecialchars($inputBillingMonth); ?></span>]</div>
                        </div>
                    </div>

                    <!-- Itemized Table -->
                    <table class="boring-table">
                        <thead>
                            <tr>
                                <th>DESCRIPTION</th>
                                <th class="text-center">QTY / UNITS</th>
                                <th class="text-end">RATE (₹)</th>
                                <th class="text-end">AMOUNT (₹)</th>
                            </tr>
                        </thead>
                        <tbody id="invTableBody">
                            <tr>
                                <td>First 50 Units (0-50)</td>
                                <td class="text-center"><?php echo $serverResult['slabs']['slab1']['units']; ?></td>
                                <td class="text-end">3.50</td>
                                <td class="text-end"><?php echo number_format($serverResult['slabs']['slab1']['cost'], 2); ?></td>
                            </tr>
                            <tr>
                                <td>Next 100 Units (51-150)</td>
                                <td class="text-center"><?php echo $serverResult['slabs']['slab2']['units']; ?></td>
                                <td class="text-end">4.00</td>
                                <td class="text-end"><?php echo number_format($serverResult['slabs']['slab2']['cost'], 2); ?></td>
                            </tr>
                            <tr>
                                <td>Next 100 Units (151-250)</td>
                                <td class="text-center"><?php echo $serverResult['slabs']['slab3']['units']; ?></td>
                                <td class="text-end">5.20</td>
                                <td class="text-end"><?php echo number_format($serverResult['slabs']['slab3']['cost'], 2); ?></td>
                            </tr>
                            <tr>
                                <td>Above 250 Units (>250)</td>
                                <td class="text-center"><?php echo $serverResult['slabs']['slab4']['units']; ?></td>
                                <td class="text-end">6.50</td>
                                <td class="text-end"><?php echo number_format($serverResult['slabs']['slab4']['cost'], 2); ?></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Summary Block -->
                    <div class="boring-summary-block">
                        <table class="boring-summary-table">
                            <tr>
                                <td>ENERGY CHARGES:</td>
                                <td class="text-end">₹<?php echo number_format($serverResult['totalEnergyCharges'], 2); ?></td>
                            </tr>
                            <tr>
                                <td>FIXED SERVICE CHARGE:</td>
                                <td class="text-end">₹<?php echo number_format($serverResult['fixedCharge'], 2); ?></td>
                            </tr>
                            <tr>
                                <td>STATE DUTY (TAX 5%):</td>
                                <td class="text-end">₹<?php echo number_format($serverResult['govTax'], 2); ?></td>
                            </tr>
                            <tr style="border-top: 2px solid #ffffff; font-weight: 800; font-size: 1.1rem;">
                                <td>BALANCE DUE (INR):</td>
                                <td class="text-end" id="invGrandTotal">₹<?php echo number_format($serverResult['grandTotal'], 2); ?></td>
                            </tr>
                        </table>
                    </div>

                    <!-- Payment & Terms Section inspired by Reference Image -->
                    <div class="boring-payment-section">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="boring-payment-title">PAYMENT</h3>
                                <div class="font-monospace small mb-2">[BANK TRANSFER / ONLINE PORTAL]</div>
                                <div class="font-monospace small">[STATE ELECTRICITY BOARD DISTRIBUTOR]</div>
                                <div class="font-monospace small">[ACCOUNT NO: 9910 8820 4410]</div>
                                <div class="font-monospace small text-muted mt-2">[TERMS: PAYABLE WITHIN 15 DAYS FROM ISSUE DATE]</div>
                            </div>
                            <div class="col-4 text-end">
                                <!-- QR Code Simulation Box -->
                                <div style="display: inline-block; border: 2px solid #ffffff; padding: 8px; background: #ffffff;">
                                    <svg width="90" height="90" viewBox="0 0 100 100" fill="#000000">
                                        <path d="M0,0 H40 V40 H0 Z M10,10 V30 H30 V10 Z M60,0 H100 V40 H60 Z M70,10 V30 H90 V10 Z M0,60 H40 V100 H0 Z M10,70 V90 H30 V70 Z M50,50 H60 V60 H50 Z M70,50 H90 V60 H70 Z M50,70 H70 V80 H50 Z M80,80 H100 V100 H80 Z M50,90 H60 V100 H50 Z" />
                                    </svg>
                                </div>
                                <div class="font-monospace text-uppercase small mt-1" style="font-size: 0.65rem;">[SCAN QR TO PAY]</div>
                            </div>
                        </div>

                        <!-- Terms & Conditions List -->
                        <div class="mt-3">
                            <div class="font-monospace small text-uppercase mb-1" style="font-size: 0.75rem;">TERMS & CONDITIONS:</div>
                            <ol class="boring-terms-list">
                                <li>This invoice covers energy consumption charges evaluated under standard state utility tariffs.</li>
                                <li>Disconnection of power line may occur if payment is not received within 15 days of issue date.</li>
                                <li>Late payments are subject to interest charges at the rate of 1.5% per month on the overdue balance.</li>
                                <li>Any dispute regarding this bill must be communicated to the Power Board billing department within 7 days.</li>
                            </ol>
                        </div>

                        <!-- Bottom Footer Metadata -->
                        <div class="boring-footer-meta">
                            <div>[STATE POWER BOARD]</div>
                            <div>[TAX REG / ABN: UT-991023]</div>
                            <div>[SUPPORT@POWERBOARD.GOV]</div>
                        </div>
                    </div>

                </div>

                <div class="modal-footer border-0 p-3 bg-black">
                    <button type="button" class="btn-minimal btn-minimal-outline" data-bs-dismiss="modal">[CLOSE]</button>
                    <button type="button" class="btn-minimal" id="btnPrintInvoice">
                        [PRINT STATEMENT / SAVE PDF]
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