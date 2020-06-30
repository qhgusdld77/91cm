package com.nineone.nocm.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.nineone.nocm.domain.Message;

public interface MessageService {
	int insertMessage(Message msg);
	List<Message> getMessageList(Map<String, Object> map);
	String makeStrDate(Date date);
	String replacemsg(String originContent);
	boolean deleteDeleteYN(int id);
}
