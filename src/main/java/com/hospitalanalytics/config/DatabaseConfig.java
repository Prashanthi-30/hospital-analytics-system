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
     *   jdbc:postgresql://host:port/dbname
     *
     * This bean parses the Render URL and builds the correct JDBC DataSource.
     */
    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new IllegalStateException("DATABASE_URL environment variable is not set.");
        }

        // Handle both postgres:// and jdbc:postgresql:// formats
        if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
            // Parse the URI
            URI dbUri = new URI(databaseUrl.replace("postgres://", "http://")
                                           .replace("postgresql://", "http://"));

            String host = dbUri.getHost();
            int port = dbUri.getPort();
            String path = dbUri.getPath(); // e.g., /dbname
            String userInfo = dbUri.getUserInfo(); // e.g., user:password

            String username = userInfo.split(":")[0];
            String password = userInfo.contains(":") ? userInfo.split(":", 2)[1] : "";

            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
            config.setDriverClassName("org.postgresql.Driver");
            config.setMaximumPoolSize(5);
            config.setConnectionTimeout(30000);

            return new HikariDataSource(config);
        }

        // Already in JDBC format — let Spring Boot handle it
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(databaseUrl);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);

        return new HikariDataSource(config);
    }
}