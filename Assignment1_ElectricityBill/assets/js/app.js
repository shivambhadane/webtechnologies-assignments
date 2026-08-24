/**
 * PowerCalc Pro - Minimalist High-Contrast Electricity Bill Calculator Logic
 * Implemented using jQuery & JavaScript (ES6+)
 */

$(document).ready(function () {
    // Initial State & Configuration
    const RATES = {
        slab1: { limit: 50, rate: 3.50 },
        slab2: { limit: 100, rate: 4.00 },
        slab3: { limit: 100, rate: 5.20 },
        slab4: { rate: 6.50 }
    };

    // DOM Elements
    const $unitsInput = $('#unitsInput');
    const $unitsRange = $('#unitsRange');
    const $liveUnitsDisplay = $('#liveUnitsDisplay');
    const $calcForm = $('#billCalcForm');
    const $themeToggle = $('#themeToggle');

    // History array stored in LocalStorage
    let billHistory = JSON.parse(localStorage.getItem('powercalc_history') || '[]');

    // ----------------------------------------------------
    // 1. Client-Side Real-Time Math & UI Sync
    // ----------------------------------------------------
    function calculateBillMath(units) {
        units = Math.max(0, parseFloat(units) || 0);
        let rem = units;

        const s1_units = Math.min(rem, 50);
        const s1_cost = s1_units * RATES.slab1.rate;
        rem -= s1_units;

        const s2_units = Math.min(rem, 100);
        const s2_cost = s2_units * RATES.slab2.rate;
        rem -= s2_units;

        const s3_units = Math.min(rem, 100);
        const s3_cost = s3_units * RATES.slab3.rate;
        rem -= s3_units;

        const s4_units = Math.max(rem, 0);
        const s4_cost = s4_units * RATES.slab4.rate;

        const totalEnergy = s1_cost + s2_cost + s3_cost + s4_cost;
        const fixedCharge = units > 0 ? 50.00 : 0.00;
        const govTax = totalEnergy * 0.05;
        const grandTotal = totalEnergy + fixedCharge + govTax;

        return {
            units: units,
            s1: { units: s1_units, cost: s1_cost },
            s2: { units: s2_units, cost: s2_cost },
            s3: { units: s3_units, cost: s3_cost },
            s4: { units: s4_units, cost: s4_cost },
            totalEnergy: totalEnergy,
            fixedCharge: fixedCharge,
            govTax: govTax,
            grandTotal: grandTotal
        };
    }

    function updateLiveUI(units) {
        const data = calculateBillMath(units);

        // Update displays
        $liveUnitsDisplay.text(data.units.toLocaleString());
        $('#dispGrandTotal').text('₹' + data.grandTotal.toFixed(2));
        $('#dispEnergyCharges').text('₹' + data.totalEnergy.toFixed(2));
        $('#dispFixedCharge').text('₹' + data.fixedCharge.toFixed(2));
        $('#dispGovTax').text('₹' + data.govTax.toFixed(2));

        // Update Slabs UI
        $('#s1Units').text(data.s1.units.toFixed(1));
        $('#s1Cost').text('₹' + data.s1.cost.toFixed(2));

        $('#s2Units').text(data.s2.units.toFixed(1));
        $('#s2Cost').text('₹' + data.s2.cost.toFixed(2));

        $('#s3Units').text(data.s3.units.toFixed(1));
        $('#s3Cost').text('₹' + data.s3.cost.toFixed(2));

        $('#s4Units').text(data.s4.units.toFixed(1));
        $('#s4Cost').text('₹' + data.s4.cost.toFixed(2));

        // Highlight Active Slab
        $('.slab-box').removeClass('active-slab');
        if (data.units > 250) $('#slabCard4').addClass('active-slab');
        else if (data.units > 150) $('#slabCard3').addClass('active-slab');
        else if (data.units > 50) $('#slabCard2').addClass('active-slab');
        else if (data.units > 0) $('#slabCard1').addClass('active-slab');

        // Progress Bar Update
        const total = data.totalEnergy || 1;
        $('#barSlab1').css('width', ((data.s1.cost / total) * 100) + '%');
        $('#barSlab2').css('width', ((data.s2.cost / total) * 100) + '%');
        $('#barSlab3').css('width', ((data.s3.cost / total) * 100) + '%');
        $('#barSlab4').css('width', ((data.s4.cost / total) * 100) + '%');
    }

    // Input & Slider Synchronization
    $unitsInput.on('input change', function () {
        let val = parseFloat($(this).val()) || 0;
        $unitsRange.val(val);
        updateLiveUI(val);
    });

    $unitsRange.on('input change', function () {
        let val = parseFloat($(this).val()) || 0;
        $unitsInput.val(val);
        updateLiveUI(val);
    });

    // ----------------------------------------------------
    // 2. Form Submission & AJAX Logic
    // ----------------------------------------------------
    $calcForm.on('submit', function (e) {
        e.preventDefault();

        const consumerName = $('#consumerName').val() || 'Valued Customer';
        const consumerNo = $('#consumerNo').val() || 'ELE-' + Math.floor(100000 + Math.random() * 900000);
        const billingMonth = $('#billingMonth').val() || 'Current Month';
        const units = parseFloat($unitsInput.val()) || 0;

        // Perform AJAX Request to calculate.php
        $.ajax({
            url: 'calculate.php',
            type: 'POST',
            data: {
                action: 'ajax_calc',
                units: units
            },
            dataType: 'json',
            beforeSend: function () {
                $('#btnCalculate').text('[ CALCULATING... ]').prop('disabled', true);
            },
            success: function (response) {
                $('#btnCalculate').text('[ CALCULATE BILL (PHP / AJAX) ]').prop('disabled', false);

                if (response.status === 'success') {
                    const data = response.data;
                    renderInvoiceModal(consumerName, consumerNo, billingMonth, data);
                    saveToHistory(consumerName, consumerNo, billingMonth, data.units, data.grandTotal);
                }
            },
            error: function () {
                $('#btnCalculate').text('[ CALCULATE BILL (PHP / AJAX) ]').prop('disabled', false);
                // Fallback client-side rendering
                const clientData = calculateBillMath(units);
                renderInvoiceModal(consumerName, consumerNo, billingMonth, clientData);
                saveToHistory(consumerName, consumerNo, billingMonth, clientData.units, clientData.grandTotal);
            }
        });
    });

    // ----------------------------------------------------
    // 3. Invoice Modal Render & Print Handler
    // ----------------------------------------------------
    function renderInvoiceModal(name, accNo, month, bill) {
        $('#invName').text(name);
        $('#invAccNo').text(accNo);
        $('#invMonth').text(month);
        $('#invGrandTotal').text('₹' + bill.grandTotal.toFixed(2));

        const s1_u = bill.slabs ? bill.slabs.slab1.units : bill.s1.units;
        const s1_c = bill.slabs ? bill.slabs.slab1.cost : bill.s1.cost;
        const s2_u = bill.slabs ? bill.slabs.slab2.units : bill.s2.units;
        const s2_c = bill.slabs ? bill.slabs.slab2.cost : bill.s2.cost;
        const s3_u = bill.slabs ? bill.slabs.slab3.units : bill.s3.units;
        const s3_c = bill.slabs ? bill.slabs.slab3.cost : bill.s3.cost;
        const s4_u = bill.slabs ? bill.slabs.slab4.units : bill.s4.units;
        const s4_c = bill.slabs ? bill.slabs.slab4.cost : bill.s4.cost;

        let html = `
            <tr>
                <td>First 50 Units (0-50)</td>
                <td class="text-center">${s1_u}</td>
                <td class="text-end">3.50</td>
                <td class="text-end">${s1_c.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Next 100 Units (51-150)</td>
                <td class="text-center">${s2_u}</td>
                <td class="text-end">4.00</td>
                <td class="text-end">${s2_c.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Next 100 Units (151-250)</td>
                <td class="text-center">${s3_u}</td>
                <td class="text-end">5.20</td>
                <td class="text-end">${s3_c.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Above 250 Units (>250)</td>
                <td class="text-center">${s4_u}</td>
                <td class="text-end">6.50</td>
                <td class="text-end">${s4_c.toFixed(2)}</td>
            </tr>
        `;

        $('#invTableBody').html(html);
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    }

    $('#btnPrintInvoice').on('click', function () {
        window.print();
    });

    // ----------------------------------------------------
    // 4. Appliance Estimator Logic
    // ----------------------------------------------------
    $(document).on('input change', '.appliance-row input', function () {
        calculateApplianceTotal();
    });

    $('#btnAddAppliance').on('click', function () {
        const newRowHtml = `
            <tr class="appliance-row">
                <td><input type="text" class="form-control-minimal app-name" value="Custom Device"></td>
                <td><input type="number" class="form-control-minimal app-watts" value="100" min="1"></td>
                <td><input type="number" class="form-control-minimal app-qty" value="1" min="1"></td>
                <td><input type="number" class="form-control-minimal app-hours" value="5" min="0" max="24"></td>
                <td class="text-end fw-bold app-units">15.0</td>
                <td class="text-center"><button class="btn-minimal btn-minimal-outline py-1 px-2 btn-remove-app">[X]</button></td>
            </tr>
        `;
        $('#applianceTableBody').append(newRowHtml);
        calculateApplianceTotal();
    });

    $(document).on('click', '.btn-remove-app', function () {
        $(this).closest('tr').remove();
        calculateApplianceTotal();
    });

    function calculateApplianceTotal() {
        let totalMonthlyUnits = 0;
        $('.appliance-row').each(function () {
            const watts = parseFloat($(this).find('.app-watts').val()) || 0;
            const qty = parseFloat($(this).find('.app-qty').val()) || 0;
            const hours = parseFloat($(this).find('.app-hours').val()) || 0;

            const dailyKwh = (watts * qty * hours) / 1000;
            const monthlyKwh = dailyKwh * 30;

            $(this).find('.app-units').text(monthlyKwh.toFixed(1));
            totalMonthlyUnits += monthlyKwh;
        });

        $('#estimatedApplianceUnits').text(Math.round(totalMonthlyUnits));
    }

    $('#btnApplyEstimatedUnits').on('click', function () {
        const units = Math.round(parseFloat($('#estimatedApplianceUnits').text()) || 0);
        $unitsInput.val(units).trigger('change');
        // Switch to Calculator tab
        const calcTab = new bootstrap.Tab(document.getElementById('pills-calculator-tab'));
        calcTab.show();
    });

    // ----------------------------------------------------
    // 5. History & LocalStorage
    // ----------------------------------------------------
    function saveToHistory(name, accNo, month, units, amount) {
        const entry = {
            id: Date.now(),
            name: name,
            accNo: accNo,
            month: month,
            units: units,
            amount: amount,
            date: new Date().toLocaleDateString()
        };
        billHistory.unshift(entry);
        if (billHistory.length > 10) billHistory.pop();
        localStorage.setItem('powercalc_history', JSON.stringify(billHistory));
        renderHistoryTable();
    }

    function renderHistoryTable() {
        if (billHistory.length === 0) {
            $('#historyTableBody').html('<tr><td colspan="5" class="text-center text-muted py-4">[ NO CALCULATION HISTORY RECORDED ]</td></tr>');
            return;
        }

        let html = '';
        billHistory.forEach(item => {
            html += `
                <tr>
                    <td>[${item.date}]</td>
                    <td><strong>${item.name}</strong> <br><small class="text-muted">[#${item.accNo}]</small></td>
                    <td>${item.month}</td>
                    <td>${item.units} KWH</td>
                    <td class="text-end fw-bold">₹${item.amount.toFixed(2)}</td>
                </tr>
            `;
        });
        $('#historyTableBody').html(html);
    }

    $('#btnClearHistory').on('click', function () {
        billHistory = [];
        localStorage.removeItem('powercalc_history');
        renderHistoryTable();
    });

    // ----------------------------------------------------
    // 6. Theme Toggle
    // ----------------------------------------------------
    $themeToggle.on('click', function () {
        const currentTheme = $('html').attr('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        $('html').attr('data-theme', newTheme);
        $(this).text(newTheme === 'dark' ? '[THEME MODE]' : '[LIGHT MODE]');
    });

    // Initializations
    updateLiveUI($unitsInput.val());
    calculateApplianceTotal();
    renderHistoryTable();
});
