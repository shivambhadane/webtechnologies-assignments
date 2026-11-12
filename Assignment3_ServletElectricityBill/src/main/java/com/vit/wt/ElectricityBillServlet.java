package com.vit.wt;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * CS3111: Web Technologies - Practical 3
 * Responsive Electricity Bill Calculator Servlet
 * 
 * Slabs:
 *   Slab 1: First 50 units      @ Rs. 3.50 / unit
 *   Slab 2: Next 100 units (51-150)  @ Rs. 4.00 / unit
 *   Slab 3: Next 100 units (151-250) @ Rs. 5.20 / unit
 *   Slab 4: Above 250 units         @ Rs. 6.50 / unit
 */
@WebServlet(name = "ElectricityBillServlet", urlPatterns = {"/calculate", "/bill"})
public class ElectricityBillServlet extends HttpServlet {

    private static final DecimalFormat DF = new DecimalFormat("0.00");

    public static class BillResult {
        public double units;
        public double slab1Units = 0.0;
        public double slab1Cost = 0.0;
        public double slab2Units = 0.0;
        public double slab2Cost = 0.0;
        public double slab3Units = 0.0;
        public double slab3Cost = 0.0;
        public double slab4Units = 0.0;
        public double slab4Cost = 0.0;
        public double totalEnergyCharges = 0.0;
        public double fixedCharges = 50.0; // Standard nominal meter charge
        public double electricityDuty = 0.0; // 9% state duty
        public double totalPayable = 0.0;
    }

    public static BillResult calculateBill(double units) {
        BillResult b = new BillResult();
        b.units = units;

        if (units <= 0) {
            b.totalPayable = b.fixedCharges;
            return b;
        }

        double remaining = units;

        // Slab 1: First 50 units @ 3.50
        if (remaining > 0) {
            b.slab1Units = Math.min(remaining, 50.0);
            b.slab1Cost = b.slab1Units * 3.50;
            remaining -= b.slab1Units;
        }

        // Slab 2: Next 100 units @ 4.00 (51 - 150)
        if (remaining > 0) {
            b.slab2Units = Math.min(remaining, 100.0);
            b.slab2Cost = b.slab2Units * 4.00;
            remaining -= b.slab2Units;
        }

        // Slab 3: Next 100 units @ 5.20 (151 - 250)
        if (remaining > 0) {
            b.slab3Units = Math.min(remaining, 100.0);
            b.slab3Cost = b.slab3Units * 5.20;
            remaining -= b.slab3Units;
        }

        // Slab 4: Above 250 units @ 6.50
        if (remaining > 0) {
            b.slab4Units = remaining;
            b.slab4Cost = b.slab4Units * 6.50;
        }

        b.totalEnergyCharges = b.slab1Cost + b.slab2Cost + b.slab3Cost + b.slab4Cost;
        b.electricityDuty = b.totalEnergyCharges * 0.09; // 9% Electricity Duty
        b.totalPayable = b.totalEnergyCharges + b.fixedCharges + b.electricityDuty;

        return b;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String unitsParam = request.getParameter("units");
        if (unitsParam != null && !unitsParam.trim().isEmpty()) {
            doPost(request, response);
        } else {
            response.sendRedirect("index.html");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String consumerName = request.getParameter("consumer_name");
        if (consumerName == null || consumerName.trim().isEmpty()) {
            consumerName = "VIT Consumer";
        }

        String consumerNo = request.getParameter("consumer_no");
        if (consumerNo == null || consumerNo.trim().isEmpty()) {
            consumerNo = "VIT-WT-" + (int)(Math.random() * 90000 + 10000);
        }

        String unitsParam = request.getParameter("units");
        double units = 0.0;
        boolean error = false;
        String errorMessage = "";

        try {
            if (unitsParam == null || unitsParam.trim().isEmpty()) {
                throw new IllegalArgumentException("Units consumed cannot be empty.");
            }
            units = Double.parseDouble(unitsParam);
            if (units < 0) {
                throw new IllegalArgumentException("Units cannot be negative.");
            }
        } catch (NumberFormatException e) {
            error = true;
            errorMessage = "Invalid numeric input for units: " + unitsParam;
        } catch (IllegalArgumentException e) {
            error = true;
            errorMessage = e.getMessage();
        }

        String format = request.getParameter("format");
        boolean isJson = "json".equalsIgnoreCase(format) 
                || "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));

        if (isJson) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();

            if (error) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false,\"error\":\"" + escapeJson(errorMessage) + "\"}");
            } else {
                BillResult r = calculateBill(units);
                out.print("{"
                    + "\"success\":true,"
                    + "\"units\":" + r.units + ","
                    + "\"slab1\":{\"units\":" + r.slab1Units + ",\"rate\":3.50,\"cost\":" + DF.format(r.slab1Cost) + "},"
                    + "\"slab2\":{\"units\":" + r.slab2Units + ",\"rate\":4.00,\"cost\":" + DF.format(r.slab2Cost) + "},"
                    + "\"slab3\":{\"units\":" + r.slab3Units + ",\"rate\":5.20,\"cost\":" + DF.format(r.slab3Cost) + "},"
                    + "\"slab4\":{\"units\":" + r.slab4Units + ",\"rate\":6.50,\"cost\":" + DF.format(r.slab4Cost) + "},"
                    + "\"energyCharges\":" + DF.format(r.totalEnergyCharges) + ","
                    + "\"fixedCharges\":" + DF.format(r.fixedCharges) + ","
                    + "\"duty\":" + DF.format(r.electricityDuty) + ","
                    + "\"totalPayable\":" + DF.format(r.totalPayable)
                    + "}");
            }
            return;
        }

        // HTML Response View
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        if (error) {
            renderErrorPage(out, errorMessage);
            return;
        }

        BillResult result = calculateBill(units);
        renderInvoicePage(out, consumerName, consumerNo, result);
    }

    private void renderInvoicePage(PrintWriter out, String name, String accountNo, BillResult r) {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        String dueDate = LocalDate.now().plusDays(15).format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("    <meta charset='UTF-8'>");
        out.println("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("    <title>Electricity Bill Statement - " + accountNo + "</title>");
        out.println("    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>");
        out.println("    <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' rel='stylesheet'>");
        out.println("    <style>");
        out.println("        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #1e293b; }");
        out.println("        .invoice-card { max-width: 850px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }");
        out.println("        .invoice-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 32px; border-radius: 16px 16px 0 0; }");
        out.println("        .badge-pill { padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; }");
        out.println("        .table-custom th { background-color: #f1f5f9; color: #475569; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }");
        out.println("        .amount-display { font-size: 2.2rem; font-weight: 800; color: #0f172a; }");
        out.println("        @media print { .no-print { display: none !important; } .invoice-card { box-shadow: none; border: none; margin: 0; } body { background: white; } }");
        out.println("    </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<div class='container'>");
        out.println("    <div class='invoice-card'>");
        out.println("        <div class='invoice-header d-flex justify-content-between align-items-center'>");
        out.println("            <div>");
        out.println("                <span class='badge bg-warning text-dark mb-2'>Java Servlet 6.0</span>");
        out.println("                <h3 class='mb-1 fw-bold'>MahaVidyut Electricity Utility Ltd.</h3>");
        out.println("                <p class='mb-0 text-white-50 small'>CS3111 Web Technologies - Practical 3 (Servlet Engine)</p>");
        out.println("            </div>");
        out.println("            <div class='text-end'>");
        out.println("                <h5 class='mb-0 fw-semibold text-warning'>TAX INVOICE</h5>");
        out.println("                <p class='mb-0 small text-white-50'>Bill Date: " + today + "</p>");
        out.println("            </div>");
        out.println("        </div>");
        out.println("        <div class='p-4 p-md-5'>");
        out.println("            <div class='row g-4 mb-4 pb-4 border-bottom'>");
        out.println("                <div class='col-md-6'>");
        out.println("                    <span class='text-muted small text-uppercase fw-bold'>Billed To</span>");
        out.println("                    <h5 class='fw-bold mb-1'>" + name + "</h5>");
        out.println("                    <p class='text-muted mb-0 small'>Consumer No: <span class='fw-semibold text-dark'>" + accountNo + "</span></p>");
        out.println("                    <p class='text-muted mb-0 small'>Tariff Category: <span class='badge bg-light text-secondary border'>LT-1 Domestic</span></p>");
        out.println("                </div>");
        out.println("                <div class='col-md-6 text-md-end'>");
        out.println("                    <span class='text-muted small text-uppercase fw-bold'>Due Date</span>");
        out.println("                    <h5 class='fw-bold text-danger mb-1'>" + dueDate + "</h5>");
        out.println("                    <p class='text-muted mb-0 small'>Total Units Consumed: <strong class='text-primary fs-5'>" + DF.format(r.units) + "</strong> kWh</p>");
        out.println("                </div>");
        out.println("            </div>");

        out.println("            <h6 class='fw-bold text-uppercase text-secondary mb-3'>Itemized Tariff Slab Calculation</h6>");
        out.println("            <div class='table-responsive mb-4'>");
        out.println("                <table class='table table-bordered table-custom align-middle'>");
        out.println("                    <thead>");
        out.println("                        <tr>");
        out.println("                            <th>Slab Range</th>");
        out.println("                            <th>Applicable Rate</th>");
        out.println("                            <th class='text-center'>Units In Slab</th>");
        out.println("                            <th class='text-end'>Slab Total (Rs.)</th>");
        out.println("                        </tr>");
        out.println("                    </thead>");
        out.println("                    <tbody>");
        out.println("                        <tr>");
        out.println("                            <td>Slab 1 (1 - 50 units)</td>");
        out.println("                            <td>Rs. 3.50 / unit</td>");
        out.println("                            <td class='text-center'>" + DF.format(r.slab1Units) + "</td>");
        out.println("                            <td class='text-end fw-semibold'>Rs. " + DF.format(r.slab1Cost) + "</td>");
        out.println("                        </tr>");
        out.println("                        <tr>");
        out.println("                            <td>Slab 2 (51 - 150 units)</td>");
        out.println("                            <td>Rs. 4.00 / unit</td>");
        out.println("                            <td class='text-center'>" + DF.format(r.slab2Units) + "</td>");
        out.println("                            <td class='text-end fw-semibold'>Rs. " + DF.format(r.slab2Cost) + "</td>");
        out.println("                        </tr>");
        out.println("                        <tr>");
        out.println("                            <td>Slab 3 (151 - 250 units)</td>");
        out.println("                            <td>Rs. 5.20 / unit</td>");
        out.println("                            <td class='text-center'>" + DF.format(r.slab3Units) + "</td>");
        out.println("                            <td class='text-end fw-semibold'>Rs. " + DF.format(r.slab3Cost) + "</td>");
        out.println("                        </tr>");
        out.println("                        <tr>");
        out.println("                            <td>Slab 4 (&gt; 250 units)</td>");
        out.println("                            <td>Rs. 6.50 / unit</td>");
        out.println("                            <td class='text-center'>" + DF.format(r.slab4Units) + "</td>");
        out.println("                            <td class='text-end fw-semibold'>Rs. " + DF.format(r.slab4Cost) + "</td>");
        out.println("                        </tr>");
        out.println("                    </tbody>");
        out.println("                </table>");
        out.println("            </div>");

        out.println("            <div class='row justify-content-end mb-4'>");
        out.println("                <div class='col-md-6'>");
        out.println("                    <ul class='list-group list-group-flush'>");
        out.println("                        <li class='list-group-item d-flex justify-content-between py-2'><span>Energy Charges</span><strong>Rs. " + DF.format(r.totalEnergyCharges) + "</strong></li>");
        out.println("                        <li class='list-group-item d-flex justify-content-between py-2'><span>Fixed Meter Charges</span><span>Rs. " + DF.format(r.fixedCharges) + "</span></li>");
        out.println("                        <li class='list-group-item d-flex justify-content-between py-2'><span>Electricity Duty (9%)</span><span>Rs. " + DF.format(r.electricityDuty) + "</span></li>");
        out.println("                        <li class='list-group-item d-flex justify-content-between py-3 bg-light border-top border-2'><strong>TOTAL AMOUNT PAYABLE</strong><span class='amount-display text-primary'>Rs. " + DF.format(r.totalPayable) + "</span></li>");
        out.println("                    </ul>");
        out.println("                </div>");
        out.println("            </div>");

        out.println("            <div class='d-flex gap-2 justify-content-between align-items-center pt-3 border-top no-print'>");
        out.println("                <a href='index.html' class='btn btn-outline-secondary'><i class='bi bi-arrow-left'></i> Back to Calculator</a>");
        out.println("                <button onclick='window.print()' class='btn btn-primary px-4 fw-semibold'>Print / Download PDF</button>");
        out.println("            </div>");
        out.println("        </div>");
        out.println("    </div>");
        out.println("</div>");
        out.println("</body>");
        out.println("</html>");
    }

    private void renderErrorPage(PrintWriter out, String msg) {
        out.println("<!DOCTYPE html><html><head><title>Error</title><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'></head><body class='bg-light p-5'>");
        out.println("<div class='card shadow-sm max-w-lg mx-auto p-4' style='max-width: 500px;'>");
        out.println("<h4 class='text-danger'>Calculation Error</h4>");
        out.println("<p class='text-muted'>" + msg + "</p>");
        out.println("<a href='index.html' class='btn btn-secondary'>Go Back</a>");
        out.println("</div></body></html>");
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
