package com.nineone.nocm.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import com.nineone.nocm.domain.User;
import com.nineone.nocm.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationSuccessHandler extends  SavedRequestAwareAuthenticationSuccessHandler{

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		User user = userRepository.getUserfindByEmail(request.getParameter("email"));
		user.setPassword(null);
		HttpSession session = request.getSession();
		session.setAttribute("user", user);
		getRedirectStrategy().sendRedirect(request, response, "/main");

		  
	}

	
}
