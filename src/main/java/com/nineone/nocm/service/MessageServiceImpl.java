package com.nineone.nocm.service;

import com.nineone.nocm.domain.Message;
import com.nineone.nocm.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class MessageServiceImpl implements MessageService {

	@Autowired
	private MessageRepository messageRepository;

	@Override
	public int insertMessage(Message msg) {
		return messageRepository.insertMessage(msg);
	}


	@Override
	public List<Message> getMessageList(Map<String, Object> map) {
		List<Message> list = messageRepository.getMessageList(map);
		for(int i=0; i < list.size(); i++) {
			list.get(i).setStr_send_date(makeStrDate(list.get(i).getSend_date()));
		}
		return list;
	}


	@Override
	public String makeStrDate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("HH:mm aa MMMM dd",Locale.ENGLISH);
		return format.format(date);
	}


	@Override
	public String replacemsg(String originContent) {
		String[] arr = originContent.split("\n");
		String newMsg = "";
		for (String origin : arr) {
			newMsg += "<p>" + origin + "</p>";
		}
		return newMsg;
	}
}
