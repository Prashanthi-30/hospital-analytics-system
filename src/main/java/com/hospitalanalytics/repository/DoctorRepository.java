package com.hospitalanalytics.repository;

import com.hospitalanalytics.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}