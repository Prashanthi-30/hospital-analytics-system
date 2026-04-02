package com.hospitalanalytics.service;

import com.hospitalanalytics.dto.AppointmentRequestDTO;
import com.hospitalanalytics.model.Appointment;
import com.hospitalanalytics.model.Doctor;
import com.hospitalanalytics.model.Patient;
import com.hospitalanalytics.repository.AppointmentRepository;
import com.hospitalanalytics.repository.DoctorRepository;
import com.hospitalanalytics.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, 
                              PatientRepository patientRepository, 
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment bookAppointment(AppointmentRequestDTO request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElse(null);
        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus("SCHEDULED");
        appointment.setType(request.getType());
        
        return appointmentRepository.save(appointment);
    }
}