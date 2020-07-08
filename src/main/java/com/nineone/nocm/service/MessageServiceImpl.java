package com.nineone.nocm.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nineone.nocm.domain.Message;
import com.nineone.nocm.repository.MessageRepository;

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
        for (int i = 0; i < list.size(); i++) {
            list.get(i).setStr_send_date(makeStrDate(list.get(i).getSend_date()));
        }
        return list;
    }


    @Override
    public String makeStrDate(Date date) {
        SimpleDateFormat format = new SimpleDateFormat("aa hh:mm");
        return format.format(date);
    }


    @Override
    public String replacemsg(String originContent) {
        String[] arr = originContent.split("\n");
        String newMsg = "";
        for (String origin : arr) {
            newMsg += "<p>" + origin + "</p>";
        }
        newMsg = newMsg.replace(" ", "&nbsp;");
        return newMsg;
    }


	@Override
	public boolean deleteDeleteYN(int id) {
		return (messageRepository.deleteDeleteYN(id)>0) ? true : false; 
	}

	@Override
	public boolean isFirstMsgToday(String date, int channel_id) {
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("date", date);
		map.put("channel_id", channel_id);
		return (messageRepository.selectTodayMsgCnt(map) == 0 ) ? true : false;
	}
	
}