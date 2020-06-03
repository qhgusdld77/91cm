package com.nineone.nocm.service;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import com.nineone.nocm.domain.User;

import java.util.List;

public interface UserService extends UserDetailsService {

	boolean insertUser(User user,DefaultOAuth2User oauth2user,HttpSession httpsession);
	boolean userinfoUpdate(User user);
	boolean emailCheck(String userEmail);
	List<User> getAllUserList();
	List<User> getCurrentChannelUserList(int channel_id);

}
