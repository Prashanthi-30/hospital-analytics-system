package com.hospitalanalytics.service;

import com.hospitalanalytics.dto.AnalyticsResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    private final AnalyticsService analyticsService;

    public ChatbotService(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    public String query(String message) {
        String msg = message.toLowerCase();
        AnalyticsResponseDTO analytics = analyticsService.getAnalytics();

        if (msg.contains("total patients") || msg.contains("how many patients")) {
            return "There are currently " + analytics.getTotalPatients() + " patients registered in the system.";
        }
        if (msg.contains("attendance") || msg.contains("no-show")) {
            return "The overall hospital attendance rate is " + analytics.getOverallAttendanceRate() + "%.";
        }
        if (msg.contains("doctors") || msg.contains("staff")) {
            return "We have " + analytics.getTotalDoctors() + " active doctors across all departments.";
        }
        if (msg.contains("appointments") || msg.contains("schedule")) {
            return "There are " + analytics.getTotalAppointments() + " total appointments logged, with " + 
                   analytics.getAppointmentsToday() + " scheduled for today.";
        }
        
        return "I can help with patient counts, attendance rates, doctor availability, and appointment schedules. Try asking 'What is the attendance rate?'";
    }
}