package com.nineone.nocm.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nineone.nocm.domain.User;
import com.nineone.nocm.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private HttpSession httpSession;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // 추후 Form 로그인 용
    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
//		Map<String,String> userInfo = (Map<String, String>) userRepository.getUserfindByEmail(userEmail);
//		User user = User.builder()
//				.name(userInfo.get("name"))
//				.email(userInfo.get("email"))
//				.phone(userInfo.get("phone"))
//				.picture(userInfo.get("picture"))
//				.build();
//		if (user == null){
//			throw new UsernameNotFoundException("can not find user");
//		}
//		return (UserDetails) user;
        return null;
    }


    @Override
    public boolean emailCheck(String email) {
        return (userRepository.getUserfindByEmail(email) == null) ? true : false;
    }


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

}
