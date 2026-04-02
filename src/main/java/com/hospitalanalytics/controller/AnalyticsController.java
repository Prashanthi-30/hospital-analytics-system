package com.hospitalanalytics.controller;

import com.hospitalanalytics.dto.AnalyticsResponseDTO;
import com.hospitalanalytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public AnalyticsResponseDTO getAnalytics() {
        return analyticsService.getAnalytics();
    }
}