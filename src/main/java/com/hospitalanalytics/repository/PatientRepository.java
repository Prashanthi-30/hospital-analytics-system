package com.hospitalanalytics.repository;

import com.hospitalanalytics.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}