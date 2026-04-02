package com.hospitalanalytics.util;

import java.time.LocalDateTime;

public class DateUtil {

    public static boolean isPast(LocalDateTime time) {
        return time.isBefore(LocalDateTime.now());
    }
}