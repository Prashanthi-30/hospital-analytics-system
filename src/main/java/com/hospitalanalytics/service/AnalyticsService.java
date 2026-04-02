package com.hospitalanalytics.service;

import com.hospitalanalytics.dto.AnalyticsResponseDTO;
import com.hospitalanalytics.model.Appointment;
import com.hospitalanalytics.repository.AppointmentRepository;
import com.hospitalanalytics.repository.DoctorRepository;
import com.hospitalanalytics.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AnalyticsService(AppointmentRepository appointmentRepository,
                            PatientRepository patientRepository,
                            DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public AnalyticsResponseDTO getAnalytics() {
        List<Appointment> appointments = appointmentRepository.findAll();
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointments.size();

        long attended = appointments.stream().filter(a -> "ATTENDED".equalsIgnoreCase(a.getStatus())).count();
        double attendanceRate = totalAppointments > 0 ? (double) attended / totalAppointments * 100 : 0.0;

        LocalDateTime today = LocalDateTime.now();
        long appointmentsToday = appointments.stream()
                .filter(a -> a.getAppointmentTime() != null && a.getAppointmentTime().toLocalDate().isEqual(today.toLocalDate()))
                .count();

        AnalyticsResponseDTO dto = new AnalyticsResponseDTO();
        dto.setTotalPatients(totalPatients);
        dto.setTotalDoctors(totalDoctors);
        dto.setTotalAppointments(totalAppointments);
        dto.setOverallAttendanceRate(Math.round(attendanceRate * 10) / 10.0);
        dto.setAppointmentsToday(appointmentsToday);

        // Attendance Trends (Mock data for charts but formatted correctly)
        List<Map<String, Object>> trends = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        Random random = new Random();
        for (String month : months) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", month);
            data.put("attendance", 70 + random.nextInt(25)); // 70-95%
            data.put("noShow", 5 + random.nextInt(15)); // 5-20%
            trends.add(data);
        }
        dto.setAttendanceTrends(trends);

        // Department Distribution
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("Cardiology", 25L);
        distribution.put("Neurology", 15L);
        distribution.put("Pediatrics", 30L);
        distribution.put("General", 20L);
        distribution.put("Orthopedic", 10L);
        dto.setDepartmentDistribution(distribution);

        return dto;
    }
}