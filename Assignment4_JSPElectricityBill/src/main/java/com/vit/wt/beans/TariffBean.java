package com.vit.wt.beans;

import java.io.Serializable;

/**
 * CS3111: Web Technologies - Practical 4
 * JavaBean encapsulating electricity tariff business logic
 * Spec-compliant: no-arg constructor, private fields, getters/setters, Serializable.
 */
public class TariffBean implements Serializable {

    private static final long serialVersionUID = 1L;

    // Input fields
    private String consumerName = "VIT Consumer";
    private String consumerNo = "VIT-JSP-10023";
    private String category = "LT-1 Residential";
    private double units = 120.0;

    // Calculation result fields
    private double slab1Units = 0.0;
    private double slab1Cost = 0.0;
    private double slab2Units = 0.0;
    private double slab2Cost = 0.0;
    private double slab3Units = 0.0;
    private double slab3Cost = 0.0;
    private double slab4Units = 0.0;
    private double slab4Cost = 0.0;

    private double totalEnergyCharges = 0.0;
    private double fixedCharges = 50.0;
    private double electricityDuty = 0.0; // 9% state duty
    private double totalPayable = 0.0;

    public TariffBean() {
        calculate();
    }

    public void calculate() {
        if (units <= 0) {
            slab1Units = slab1Cost = 0;
            slab2Units = slab2Cost = 0;
            slab3Units = slab3Cost = 0;
            slab4Units = slab4Cost = 0;
            totalEnergyCharges = 0;
            electricityDuty = 0;
            totalPayable = fixedCharges;
            return;
        }

        double rem = units;

        // Slab 1: 0 to 50 @ 3.50
        slab1Units = Math.min(rem, 50.0);
        slab1Cost = slab1Units * 3.50;
        rem -= slab1Units;

        // Slab 2: 51 to 150 @ 4.00
        if (rem > 0) {
            slab2Units = Math.min(rem, 100.0);
            slab2Cost = slab2Units * 4.00;
            rem -= slab2Units;
        } else {
            slab2Units = slab2Cost = 0.0;
        }

        // Slab 3: 151 to 250 @ 5.20
        if (rem > 0) {
            slab3Units = Math.min(rem, 100.0);
            slab3Cost = slab3Units * 5.20;
            rem -= slab3Units;
        } else {
            slab3Units = slab3Cost = 0.0;
        }

        // Slab 4: > 250 @ 6.50
        if (rem > 0) {
            slab4Units = rem;
            slab4Cost = slab4Units * 6.50;
        } else {
            slab4Units = slab4Cost = 0.0;
        }

        totalEnergyCharges = slab1Cost + slab2Cost + slab3Cost + slab4Cost;
        electricityDuty = totalEnergyCharges * 0.09;
        totalPayable = totalEnergyCharges + fixedCharges + electricityDuty;
    }

    // Getters and Setters
    public String getConsumerName() { return consumerName; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }

    public String getConsumerNo() { return consumerNo; }
    public void setConsumerNo(String consumerNo) { this.consumerNo = consumerNo; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getUnits() { return units; }
    public void setUnits(double units) {
        this.units = units;
        calculate();
    }

    public double getSlab1Units() { return slab1Units; }
    public double getSlab1Cost() { return slab1Cost; }

    public double getSlab2Units() { return slab2Units; }
    public double getSlab2Cost() { return slab2Cost; }

    public double getSlab3Units() { return slab3Units; }
    public double getSlab3Cost() { return slab3Cost; }

    public double getSlab4Units() { return slab4Units; }
    public double getSlab4Cost() { return slab4Cost; }

    public double getTotalEnergyCharges() { return totalEnergyCharges; }
    public double getFixedCharges() { return fixedCharges; }
    public double getElectricityDuty() { return electricityDuty; }
    public double getTotalPayable() { return totalPayable; }

    public int getActiveSlabNumber() {
        if (units <= 50) return 1;
        if (units <= 150) return 2;
        if (units <= 250) return 3;
        return 4;
    }
}
