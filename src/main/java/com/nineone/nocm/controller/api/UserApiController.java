package com.nineone.nocm.controller.api;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.nineone.nocm.annotation.Socialuser;
import com.nineone.nocm.domain.Authorities;
import com.nineone.nocm.domain.User;
import com.nineone.nocm.listener.WebsocketEventListener;
import com.nineone.nocm.repository.UserAuthoritiesRepository;
import com.nineone.nocm.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserApiController {

	@Autowired
	private WebsocketEventListener websocketEventListener;
	
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private UserAuthoritiesRepository authoritiesRepository;

    @RequestMapping("/list")
    public List<User> userList() {
        return userService.getAllUserList();
    }

    @PostMapping("/admin/auth")
    public ResponseEntity<?> insertUserAuth(@RequestBody Authorities authorities){
        try {
            authoritiesRepository.deleteAllAuthority(authorities.getMember_email());
            authoritiesRepository.insertAuthority(authorities);
            return new ResponseEntity<>("{}",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("{}",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping("/admin/userList")
    public List<HashMap> rolesUserList(@Socialuser User user) {
        return authoritiesRepository.getRoleUserList(user);
    }


    @RequestMapping(value = "/login")
    public boolean userInit(@Socialuser User user) {
        if (user != null) {
            return user.getPhone() != null ? true : false;
        } else {
            return false;
        }
    }
    
    
    @PostMapping("/update")
    public boolean userInfoUpdate(@RequestBody User user) {
        if (userService.userinfoUpdate(user)) {
            messagingTemplate.convertAndSend("/sub/sync/info", "userList");
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/getsession")
    public User getSessionUser(@Socialuser User user) {
        return user;
    }

    @RequestMapping(value = "/info")
    public ResponseEntity<?> userInfo(@Socialuser User user) {
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @RequestMapping(value="/formsignup", method=RequestMethod.POST)
    public boolean formSignUp(@RequestBody User user) {
    	if(userService.insertUser(user)) {
    		authoritiesRepository.insertAuthority(Authorities.builder()
                    .member_email(user.getEmail())
                    .roles_authority("ROLE_ANON")
                    .build());
    		messagingTemplate.convertAndSend("/sub/sync/info", "userList");
    		return true;
    	}  else {
            return false;
        }
    }
    
    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    @Transactional
    public boolean signup(@RequestBody User user, Authentication authentication, HttpSession httpsession) {
        DefaultOAuth2User oauth2user = (DefaultOAuth2User) authentication.getPrincipal();
        if (userService.insertUser(user, oauth2user, httpsession)) {
            authoritiesRepository.insertAuthority(Authorities.builder()
                    .member_email(user.getEmail())
                    .roles_authority("ROLE_ANON")
                    .build());
            messagingTemplate.convertAndSend("/sub/sync/info", "userList");
            return true;
        } else {
            return false;
        }
    }
    @RequestMapping(value = "/check", method = RequestMethod.POST)
    public boolean emailChecker(@RequestBody User user){
        log.info(user.getEmail());
        return userService.emailCheck(user.getEmail());
    }

    @RequestMapping(value = "/channel/{channel_id}")
    public List<User> getChannelUserList(@PathVariable int channel_id) {
    	List<User> userList = userService.getCurrentChannelUserList(channel_id);
    	Map<String,Object> sessions = websocketEventListener.getOnlineSessions();
    	for(User user : userList) {
    		if(sessions.get(user.getEmail()) !=null ) {
    			user.setOnline(true);
    		}else {
    			user.setOnline(false);
    		}
    	}
        return userList;
    }
    
    @RequestMapping(value="/invite/{channel_id}",method=RequestMethod.GET)
    public List<User> getInviteUserList(@PathVariable int channel_id){
    	return userService.getUserListForInvite(channel_id);
    }

}
