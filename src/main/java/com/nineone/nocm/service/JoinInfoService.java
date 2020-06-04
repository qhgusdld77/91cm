package com.nineone.nocm.service;

import com.nineone.nocm.domain.Invite;
import com.nineone.nocm.domain.JoinInfo;

import java.util.Map;

public interface JoinInfoService {
    boolean leaveUser(Map<String, Object> info);
    boolean isExistUser(Invite invite);
    boolean AuthorityCheck(Invite invite);
    boolean insertJoinInfo(JoinInfo joinInfo);
    int updateLastAccessDate(int CurrentChannelId,String email);
}
