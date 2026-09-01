package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.mariadb.jdbc.Driver;

public class DBConnection {

    private static final String URL =
            "jdbc:mariadb://localhost:3306/college";

    private static final String USER = "webapp";

    private static final String PASSWORD = "webapp123";

    public static Connection getConnection() {

        try {
            DriverManager.registerDriver(new Driver());

            return DriverManager.getConnection(
                    URL,
                    USER,
                    PASSWORD
            );

        } catch (SQLException e) {
            throw new RuntimeException("Database connection failed", e);
        }
    }
}