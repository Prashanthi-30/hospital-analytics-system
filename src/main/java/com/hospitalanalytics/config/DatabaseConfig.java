package com.hospitalanalytics.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    /**
     * Render provides DATABASE_URL in the format:
     *   postgres://user:password@host:port/dbname
     *
     * Spring Boot JDBC requires:
     *   jdbc:postgresql://host:port/dbname?sslmode=require
     *
     * This bean parses the Render URL and builds the correct JDBC DataSource.
     * SSL is required for Render's managed PostgreSQL databases.
     */
    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new IllegalStateException(
                "DATABASE_URL environment variable is not set. " +
                "Please configure it in your Render environment variables."
            );
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(3); // Free tier: keep connections low
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
            // Render gives postgres://user:password@host:port/dbname
            // Convert to jdbc:postgresql://host:port/dbname?sslmode=require
            URI dbUri = new URI(
                databaseUrl.replace("postgres://", "http://")
                           .replace("postgresql://", "http://")
            );

            String host     = dbUri.getHost();
            int    port     = dbUri.getPort();
            String path     = dbUri.getPath();           // /dbname
            String userInfo = dbUri.getUserInfo();       // user:password

            String username = userInfo.split(":")[0];
            String password = userInfo.contains(":") ? userInfo.split(":", 2)[1] : "";

            // SSL required on Render
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";

            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
        } else if (databaseUrl.startsWith("jdbc:postgresql://")) {
            // Already in JDBC format — ensure SSL is present
            if (!databaseUrl.contains("sslmode")) {
                databaseUrl += "?sslmode=require";
            }
            config.setJdbcUrl(databaseUrl);
        } else {
            config.setJdbcUrl(databaseUrl);
        }

        return new HikariDataSource(config);
    }
}