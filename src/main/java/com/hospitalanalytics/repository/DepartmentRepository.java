package com.hospitalanalytics.repository;

import com.hospitalanalytics.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}