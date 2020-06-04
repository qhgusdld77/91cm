package com.nineone.nocm.service;

import com.nineone.nocm.domain.Invite;

import java.util.List;

public interface InviteService {
    boolean saveInvite(Invite invite);
    List<Invite> getInviteList(String recipient);
    boolean updateInvite(Invite invite);
    boolean isExistInvite(Invite invite);
}
