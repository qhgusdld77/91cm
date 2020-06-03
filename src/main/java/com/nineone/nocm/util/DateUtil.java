package com.nineone.nocm.util;

import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	public static Date makeDate()  {
		Calendar time = Calendar.getInstance();
		return time.getTime();
	}
}
