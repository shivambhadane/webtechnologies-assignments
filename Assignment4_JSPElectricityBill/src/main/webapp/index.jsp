<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%-- Initialize Tariff JavaBean --%>
<jsp:useBean id="tariff" class="com.vit.wt.beans.TariffBean" scope="request" />
<jsp:setProperty name="tariff" property="*" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator - Advanced JSP & JSTL (CS3111)</title>
    <!-- Bootstrap 5.3 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
        }
        .header-bg {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
            color: white;
            padding: 40px 0 65px 0;
            border-bottom: 4px solid #6366f1;
        }
        .content-card {
            margin-top: -40px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .slab-box {
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            background: #f8fafc;
            transition: all 0.2s ease-in-out;
        }
        .slab-box.active {
            border-color: #4f46e5;
            background: #eef2ff;
            transform: translateY(-3px);
            box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.15);
        }
        .amount-hero {
            font-size: 2.25rem;
            font-weight: 800;
            color: #4f46e5;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header class="header-bg text-center">
        <div class="container">
            <span class="badge bg-indigo-subtle text-warning px-3 py-2 rounded-pill fw-semibold mb-2 border border-warning">
                <i class="bi bi-code-square me-1"></i> JSP 3.1 • JSTL 3.0 • JavaBeans
            </span>
            <h1 class="fw-bold mb-2">Advanced JSP Electricity Bill Portal</h1>
            <p class="text-white-50 mb-0">CS3111: Web Technologies Laboratory • Practical 4</p>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container mb-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="content-card p-4 p-md-5">

                    <!-- Slabs Visual Overview with JSTL Conditionals -->
                    <div class="row g-3 mb-4">
                        <div class="col-6 col-md-3">
                            <div class="slab-box text-center <c:if test='${tariff.activeSlabNumber == 1}'>active</c:if>'">
                                <span class="badge bg-success-subtle text-success mb-1">Slab 1</span>
                                <h4 class="fw-bold mb-0">₹3.50</h4>
                                <small class="text-muted">1 - 50 units</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="slab-box text-center <c:if test='${tariff.activeSlabNumber == 2}'>active</c:if>'">
                                <span class="badge bg-info-subtle text-info mb-1">Slab 2</span>
                                <h4 class="fw-bold mb-0">₹4.00</h4>
                                <small class="text-muted">51 - 150 units</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="slab-box text-center <c:if test='${tariff.activeSlabNumber == 3}'>active</c:if>'">
                                <span class="badge bg-warning-subtle text-warning mb-1">Slab 3</span>
                                <h4 class="fw-bold mb-0">₹5.20</h4>
                                <small class="text-muted">151 - 250 units</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="slab-box text-center <c:if test='${tariff.activeSlabNumber == 4}'>active</c:if>'">
                                <span class="badge bg-danger-subtle text-danger mb-1">Slab 4</span>
                                <h4 class="fw-bold mb-0">₹6.50</h4>
                                <small class="text-muted">&gt; 250 units</small>
                            </div>
                        </div>
                    </div>

                    <!-- Input Form Submitting to Itself or Bill Statement -->
                    <form method="POST" action="index.jsp">
                        <div class="row g-4 mb-4">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Consumer Name</label>
                                <input type="text" name="consumerName" class="form-control form-control-lg" value="${tariff.consumerName}" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Consumer Number</label>
                                <input type="text" name="consumerNo" class="form-control form-control-lg" value="${tariff.consumerNo}" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Tariff Category</label>
                                <select name="category" class="form-select form-control-lg">
                                    <option value="LT-1 Residential" ${tariff.category == 'LT-1 Residential' ? 'selected' : ''}>LT-1 Residential</option>
                                    <option value="LT-2 Commercial" ${tariff.category == 'LT-2 Commercial' ? 'selected' : ''}>LT-2 Commercial</option>
                                </select>
                            </div>
                        </div>

                        <!-- Range Slider + Unit Input -->
                        <div class="mb-4 p-4 bg-light rounded-4 border">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label fw-bold mb-0 fs-5">Units Consumed (kWh)</label>
                                <div class="input-group" style="width: 140px;">
                                    <input type="number" id="unitsNumber" class="form-control form-control-lg fw-bold text-center" min="0" max="1000" step="1" value="${tariff.units}">
                                    <span class="input-group-text">units</span>
                                </div>
                            </div>
                            <input type="range" class="form-range" id="unitsRange" min="0" max="500" step="1" value="${tariff.units}">
                            <input type="hidden" id="units" name="units" value="${tariff.units}">
                        </div>

                        <!-- Recalculate Button -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <button type="submit" class="btn btn-outline-primary px-4 fw-bold">
                                <i class="bi bi-arrow-clockwise me-1"></i> Recalculate via JSP Action
                            </button>
                            <a href="bill_statement.jsp?units=${tariff.units}&consumerName=${tariff.consumerName}&consumerNo=${tariff.consumerNo}" class="btn btn-primary btn-lg px-5 fw-bold shadow-sm">
                                <i class="bi bi-receipt me-1"></i> View Full Bill Statement
                            </a>
                        </div>
                    </form>

                    <!-- Calculated Results Card with JSTL Formatting -->
                    <div class="border rounded-4 p-4 bg-white shadow-sm">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <h5 class="fw-bold mb-0">Current Assessment Summary</h5>
                            <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2">
                                Current Active: Slab ${tariff.activeSlabNumber}
                            </span>
                        </div>

                        <div class="table-responsive mb-3">
                            <table class="table table-sm table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Slab Tier</th>
                                        <th>Rate</th>
                                        <th class="text-center">Units in Tier</th>
                                        <th class="text-end">Tier Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Slab 1 (1 - 50 units)</td>
                                        <td>₹3.50</td>
                                        <td class="text-center"><fmt:formatNumber value="${tariff.slab1Units}" minFractionDigits="0"/></td>
                                        <td class="text-end"><fmt:formatNumber value="${tariff.slab1Cost}" type="currency" currencySymbol="₹ "/></td>
                                    </tr>
                                    <tr>
                                        <td>Slab 2 (51 - 150 units)</td>
                                        <td>₹4.00</td>
                                        <td class="text-center"><fmt:formatNumber value="${tariff.slab2Units}" minFractionDigits="0"/></td>
                                        <td class="text-end"><fmt:formatNumber value="${tariff.slab2Cost}" type="currency" currencySymbol="₹ "/></td>
                                    </tr>
                                    <tr>
                                        <td>Slab 3 (151 - 250 units)</td>
                                        <td>₹5.20</td>
                                        <td class="text-center"><fmt:formatNumber value="${tariff.slab3Units}" minFractionDigits="0"/></td>
                                        <td class="text-end"><fmt:formatNumber value="${tariff.slab3Cost}" type="currency" currencySymbol="₹ "/></td>
                                    </tr>
                                    <tr>
                                        <td>Slab 4 (&gt; 250 units)</td>
                                        <td>₹6.50</td>
                                        <td class="text-center"><fmt:formatNumber value="${tariff.slab4Units}" minFractionDigits="0"/></td>
                                        <td class="text-end"><fmt:formatNumber value="${tariff.slab4Cost}" type="currency" currencySymbol="₹ "/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="row align-items-center justify-content-between pt-2">
                            <div class="col-md-6 small text-muted">
                                <div>Fixed Meter Charge: <strong>₹ 50.00</strong></div>
                                <div>State Electricity Duty (9%): <strong><fmt:formatNumber value="${tariff.electricityDuty}" type="currency" currencySymbol="₹ "/></strong></div>
                            </div>
                            <div class="col-md-6 text-md-end mt-2 mt-md-0">
                                <span class="text-muted small d-block">Total Amount Payable:</span>
                                <span class="amount-hero"><fmt:formatNumber value="${tariff.totalPayable}" type="currency" currencySymbol="₹ "/></span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-4 text-muted small border-top bg-white">
        <p class="mb-0">CS3111: Web Technologies Laboratory • Department of Computer Engineering, VIT Pune</p>
    </footer>

    <!-- jQuery range-number sync -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#unitsRange').on('input', function() {
                var v = $(this).val();
                $('#unitsNumber').val(v);
                $('#units').val(v);
            });
            $('#unitsNumber').on('input', function() {
                var v = $(this).val();
                $('#unitsRange').val(v);
                $('#units').val(v);
            });
        });
    </script>
</body>
</html>
