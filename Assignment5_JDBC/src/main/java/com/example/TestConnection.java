package com.example;

import java.sql.Connection;

public class TestConnection {

    public static void main(String[] args) {

        Connection con = DBConnection.getConnection();

        if (con != null) {
            System.out.println("Database connected successfully!");

            try {
                con.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            System.out.println("Database connection failed!");
        }
    }
}

