package com.nineone.nocm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nineone.nocm.domain.Invite;
import com.nineone.nocm.repository.InviteRepository;

@Service
public class InviteServiceImpl implements InviteService {

    @Autowired
    private InviteRepository inviteRepository;

    @Override
    @Transactional
    public boolean saveInvite(Invite invite) {
        return (inviteRepository.saveInvite(invite)>0);
    }

    @Override
    public List<Invite> getInviteList(String recipient) {

        return inviteRepository.receiveInvites(recipient);
    }

    @Override
    public boolean updateInvite(Invite invite) {
        return (inviteRepository.updateInvite(invite) > 0);
    }

	@Override
	public boolean isExistInvite(Invite invite) {
		return inviteRepository.isExistInvite(invite);
	}
}
