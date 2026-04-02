package com.hospitalanalytics.scheduler;

import com.hospitalanalytics.service.AnalyticsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsScheduler {

    private final AnalyticsService analyticsService;

    public AnalyticsScheduler(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void runAnalytics() {
        analyticsService.getAnalytics();
    }
}