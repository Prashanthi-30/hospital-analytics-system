package com.hospitalanalytics.service;

import com.hospitalanalytics.model.Appointment;
import org.springframework.stereotype.Service;

@Service
public class NoShowPredictionService {

    public boolean predict(Appointment appointment) {
        return "MISSED".equalsIgnoreCase(appointment.getStatus());
    }
}