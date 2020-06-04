package com.nineone.nocm.listener;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@WebListener
public class HttpSessionEvnetListener implements HttpSessionListener{
	@Override
	public void sessionCreated(HttpSessionEvent se) {
		se.getSession().setMaxInactiveInterval(60*60*12);
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
	}


}
