package com.nineone.nocm.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.nineone.nocm.domain.CustomUserDetails;
import com.nineone.nocm.domain.User;
import com.nineone.nocm.repository.UserAuthoritiesRepository;
import com.nineone.nocm.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService,UserDetailsService {
    @Autowired
    private HttpSession httpSession;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserAuthoritiesRepository userAuthoritiesRepository;  

    @Autowired
    private FileStorageService fileStorageService;
    
    
    // 추후 Form 로그인 용
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    	User user = userRepository.getUserfindByEmail(email);
    	if(user == null) {
    		return null;
    	}else {
    		CustomUserDetails customUserDetails = new CustomUserDetails();
    		customUserDetails.setUsername(user.getEmail());
    		log.info(user.getPassword());
    		customUserDetails.setPassword(user.getPassword());
    		customUserDetails.setAuthorities(getAuthorities(user.getEmail()));
    		customUserDetails.setEnabled(true);
    		customUserDetails.setAccountNonExpired(true);
    		customUserDetails.setAccountNonLocked(true);
    		customUserDetails.setCredentialsNonExpired(true);

            return customUserDetails;
    	}
    	
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities(String email) {
    	List<String> roles = userAuthoritiesRepository.getUserRoles(email);
   	 	List<GrantedAuthority> authorities = new ArrayList<>();
        for (String authority : roles) {
            authorities.add(new SimpleGrantedAuthority(authority));
        }

        return authorities;
    }

    @Override
    public boolean emailCheck(String email) {
        return (userRepository.getUserfindByEmail(email) == null) ? true : false;
    }


    // 소셜로그인용 유저 insert
    @Override
    @Transactional
    public boolean insertUser(User user, DefaultOAuth2User oauth2user, HttpSession httpsession) {
        Map<String, Object> map = new HashMap<>();
        map.put("identifier", oauth2user.getName());
        map.put("email", user.getEmail());
        int userResult = 0;
        User dbUser = userRepository.getUserfindByEmail(user.getEmail());
        if (dbUser != null) {
            userResult = 1;
        } else if (user.getPicture() != null) {
            String fileName = fileStorageService.download(user.getPicture());
            if (fileName == null) {
                return false;
            } else {
                user.setPicture("/api/file/download/" + fileName);
            }
        }
        user.setPassword("oauth user");
        userResult = userRepository.insertUser(user);
        int snsResult = userRepository.insertSNSInfo(map);

        if (userResult > 0 && snsResult > 0) {
            if (dbUser == null) {
                User settingUser = (User) httpsession.getAttribute("user");
                settingUser.setName(user.getEmail());
                settingUser.setName(user.getName());
                settingUser.setPhone(user.getPhone());
                httpsession.setAttribute("user", settingUser);
            } else {
                httpsession.setAttribute("user", dbUser);
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean userinfoUpdate(User user) {
        if ((userRepository.userInfoUpdate(user) > 0)) {
            httpSession.setAttribute("user", user);
            return true;
        }
        return false;
    }


    @Override
    public List<User> getAllUserList() {
        return userRepository.getAllUserList();
    }

    @Override
    public List<User> getCurrentChannelUserList(int channel_id) {
        return userRepository.thisChannelUserList(channel_id);
    }

	@Override
	public boolean insertUser(User user) {
		// 유효성 체크를 여기서도 해줘야할 것 같은데 귀차니즘..
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return (userRepository.insertUser(user) > 0) ? true : false;
	} 

}
