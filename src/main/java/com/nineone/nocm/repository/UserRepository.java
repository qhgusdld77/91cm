package com.nineone.nocm.repository;

import java.util.Map;

import com.nineone.nocm.domain.User;

import java.util.List;

public interface UserRepository {
	int userInfoUpdate(User user);
	List<User> thisChannelUserList(int channel_id);
	int insertSNSInfo(Map<String,Object> map);
	int insertUser(User user);
	User getUserfindById(String email);
    List<User> getAllUserList();
    User getUserfindByEmail(String email);
    List<User> getUserListForInvite(int channel_id);
//    boolean isNotExistEmail(String email);
}
