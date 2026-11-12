<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<jsp:useBean id="tariff" class="com.vit.wt.beans.TariffBean" scope="request" />
<jsp:setProperty name="tariff" property="*" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Tax Invoice - ${tariff.consumerNo}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #1e293b; }
        .invoice-box { max-width: 820px; margin: 40px auto; background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .invoice-head { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; padding: 32px; border-radius: 16px 16px 0 0; }
        .amount-big { font-size: 2.25rem; font-weight: 800; color: #4338ca; }
        @media print { .no-print { display: none !important; } .invoice-box { border: none; box-shadow: none; margin: 0; } }
    </style>
</head>
<body>
<div class="container">
    <div class="invoice-box">
        <div class="invoice-head d-flex justify-content-between align-items-center">
            <div>
                <span class="badge bg-warning text-dark mb-2">JSP 3.1 &amp; JSTL Statement</span>
                <h3 class="fw-bold mb-1">MahaVidyut Distribution Ltd.</h3>
                <p class="mb-0 text-white-50 small">CS3111: Web Technologies Laboratory (Practical 4)</p>
            </div>
            <div class="text-end">
                <h5 class="text-warning fw-bold mb-0">OFFICIAL BILL INVOICE</h5>
                <p class="text-white-50 small mb-0">Status: GENERATED</p>
            </div>
        </div>

        <div class="p-4 p-md-5">
            <div class="row pb-4 mb-4 border-bottom">
                <div class="col-6">
                    <span class="text-muted small text-uppercase fw-bold">Consumer Details</span>
                    <h5 class="fw-bold mb-1">${tariff.consumerName}</h5>
                    <p class="text-muted mb-0 small">Account No: <strong>${tariff.consumerNo}</strong></p>
                    <p class="text-muted mb-0 small">Category: <span class="badge bg-light text-dark border">${tariff.category}</span></p>
                </div>
                <div class="col-6 text-end">
                    <span class="text-muted small text-uppercase fw-bold">Meter Consumption</span>
                    <h4 class="fw-bold text-primary mb-1"><fmt:formatNumber value="${tariff.units}" minFractionDigits="0"/> kWh</h4>
                    <p class="text-muted mb-0 small">Active Tier: <strong>Slab ${tariff.activeSlabNumber}</strong></p>
                </div>
            </div>

            <h6 class="fw-bold text-uppercase text-secondary mb-3">Itemized Progressive Tariff Calculation</h6>
            <table class="table table-bordered align-middle mb-4">
                <thead class="table-light">
                    <tr>
                        <th>Slab Tier</th>
                        <th>Applicable Rate</th>
                        <th class="text-center">Units in Tier</th>
                        <th class="text-end">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Slab 1 (1 - 50 units)</td>
                        <td>₹3.50 / unit</td>
                        <td class="text-center"><fmt:formatNumber value="${tariff.slab1Units}" minFractionDigits="0"/></td>
                        <td class="text-end fw-semibold"><fmt:formatNumber value="${tariff.slab1Cost}" type="currency" currencySymbol="₹ "/></td>
                    </tr>
                    <tr>
                        <td>Slab 2 (51 - 150 units)</td>
                        <td>₹4.00 / unit</td>
                        <td class="text-center"><fmt:formatNumber value="${tariff.slab2Units}" minFractionDigits="0"/></td>
                        <td class="text-end fw-semibold"><fmt:formatNumber value="${tariff.slab2Cost}" type="currency" currencySymbol="₹ "/></td>
                    </tr>
                    <tr>
                        <td>Slab 3 (151 - 250 units)</td>
                        <td>₹5.20 / unit</td>
                        <td class="text-center"><fmt:formatNumber value="${tariff.slab3Units}" minFractionDigits="0"/></td>
                        <td class="text-end fw-semibold"><fmt:formatNumber value="${tariff.slab3Cost}" type="currency" currencySymbol="₹ "/></td>
                    </tr>
                    <tr>
                        <td>Slab 4 (> 250 units)</td>
                        <td>₹6.50 / unit</td>
                        <td class="text-center"><fmt:formatNumber value="${tariff.slab4Units}" minFractionDigits="0"/></td>
                        <td class="text-end fw-semibold"><fmt:formatNumber value="${tariff.slab4Cost}" type="currency" currencySymbol="₹ "/></td>
                    </tr>
                </tbody>
            </table>

            <div class="row justify-content-end mb-4">
                <div class="col-md-6">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between py-2">
                            <span>Energy Charges</span>
                            <strong><fmt:formatNumber value="${tariff.totalEnergyCharges}" type="currency" currencySymbol="₹ "/></strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between py-2">
                            <span>Fixed Nominal Charge</span>
                            <span>₹ 50.00</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between py-2">
                            <span>Electricity Duty (9%)</span>
                            <span><fmt:formatNumber value="${tariff.electricityDuty}" type="currency" currencySymbol="₹ "/></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between py-3 bg-light border-top border-2">
                            <strong>NET AMOUNT PAYABLE</strong>
                            <span class="amount-big"><fmt:formatNumber value="${tariff.totalPayable}" type="currency" currencySymbol="₹ "/></span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-3 border-top no-print">
                <a href="index.jsp" class="btn btn-outline-secondary">← Back to Calculator</a>
                <button onclick="window.print()" class="btn btn-primary px-4 fw-bold">Print Invoice</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>
