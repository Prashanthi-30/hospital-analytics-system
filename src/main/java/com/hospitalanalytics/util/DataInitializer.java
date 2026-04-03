package com.hospitalanalytics.util;

import com.hospitalanalytics.model.Appointment;
import com.hospitalanalytics.model.Doctor;
import com.hospitalanalytics.model.Patient;
import com.hospitalanalytics.repository.AppointmentRepository;
import com.hospitalanalytics.repository.DoctorRepository;
import com.hospitalanalytics.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DataInitializer(PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if the database is empty — safe for all restarts
        if (patientRepository.count() > 0) {
            return;
        }

        // Initialize Patients
        Patient p1 = createPatient("Sarah Jenkins", "Female", 34, "95%", "active");
        Patient p2 = createPatient("Robert Smith", "Male", 58, "60%", "risk");
        Patient p3 = createPatient("Maria Garcia", "Female", 42, "100%", "active");

        patientRepository.save(p1);
        patientRepository.save(p2);
        patientRepository.save(p3);

        // Initialize Doctors
        Doctor d1 = createDoctor("Dr. James Wilson", "Cardiology", 15, "Available", 4.8);
        Doctor d2 = createDoctor("Dr. Emily Chen", "Neurology", 8, "On Break", 4.5);

        doctorRepository.save(d1);
        doctorRepository.save(d2);

        // Initialize Appointments
        createAppointment(p1, d1, LocalDateTime.now().plusHours(2), "SCHEDULED", "Checkup");
        createAppointment(p2, d2, LocalDateTime.now().minusDays(1), "ATTENDED", "Consultation");
        createAppointment(p3, d1, LocalDateTime.now().plusDays(2), "SCHEDULED", "Follow-up");
    }

    private Patient createPatient(String name, String gender, int age, String attendance, String status) {
        Patient p = new Patient();
        p.setName(name);
        p.setGender(gender);
        p.setAge(age);
        p.setAttendanceRate(attendance);
        p.setStatus(status);
        p.setEmail(name.toLowerCase().replace(" ", ".") + "@example.com");
        p.setPhone("+1-555-0101");
        p.setLastVisit("2023-10-15");
        return p;
    }

    private Doctor createDoctor(String name, String specialization, int exp, String availability, double rating) {
        Doctor d = new Doctor();
        d.setName(name);
        d.setSpecialization(specialization);
        d.setExperience(exp);
        d.setAvailability(availability);
        d.setRating(rating);
        d.setWorkload(randomWorkload());
        return d;
    }

    private void createAppointment(Patient p, Doctor d, LocalDateTime time, String status, String type) {
        Appointment a = new Appointment();
        a.setPatient(p);
        a.setDoctor(d);
        a.setAppointmentTime(time);
        a.setStatus(status);
        a.setType(type);
        appointmentRepository.save(a);
    }

    private int randomWorkload() {
        return (int) (Math.random() * 100);
    }
}
