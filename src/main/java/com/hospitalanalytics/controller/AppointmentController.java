package com.hospitalanalytics.controller;

import com.hospitalanalytics.dto.AppointmentRequestDTO;
import com.hospitalanalytics.model.Appointment;
import com.hospitalanalytics.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping
    public Appointment book(@RequestBody AppointmentRequestDTO request) {
        return appointmentService.bookAppointment(request);
    }
}