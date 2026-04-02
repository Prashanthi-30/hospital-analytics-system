package com.hospitalanalytics.dto;

import java.util.Map;
import java.util.List;

public class AnalyticsResponseDTO {

    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private double overallAttendanceRate;
    private long appointmentsToday;
    private List<Map<String, Object>> attendanceTrends;
    private Map<String, Long> departmentDistribution;

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public double getOverallAttendanceRate() {
        return overallAttendanceRate;
    }

    public void setOverallAttendanceRate(double overallAttendanceRate) {
        this.overallAttendanceRate = overallAttendanceRate;
    }

    public long getAppointmentsToday() {
        return appointmentsToday;
    }

    public void setAppointmentsToday(long appointmentsToday) {
        this.appointmentsToday = appointmentsToday;
    }

    public List<Map<String, Object>> getAttendanceTrends() {
        return attendanceTrends;
    }

    public void setAttendanceTrends(List<Map<String, Object>> attendanceTrends) {
        this.attendanceTrends = attendanceTrends;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }
}