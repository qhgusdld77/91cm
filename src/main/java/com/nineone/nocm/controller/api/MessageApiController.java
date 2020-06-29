package com.nineone.nocm.controller.api;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import com.nineone.nocm.util.GoogleMailSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.nineone.nocm.domain.Message;
import com.nineone.nocm.service.MessageService;

@Slf4j
@RestController
@RequestMapping("/api/message")
public class MessageApiController {
	
	@Autowired
	MessageService messageServie;

	@Autowired
	private GoogleMailSender googleMailSender;
	
	@RequestMapping(value ="/getmsg",method=RequestMethod.POST)
	public List<Message> getMsg(@RequestBody Map<String,Object> map) throws ParseException{
		return messageServie.getMessageList(map);
	}
	@RequestMapping(value = "/send/mail", method = RequestMethod.POST)
	public boolean sendMail(@RequestBody Map<String,String> messageMap) throws RuntimeException{
		log.info(messageMap.get("toUser"));
		googleMailSender.MailSend(messageMap.get("channelName")+" 채널에서 새로운 메시지가 왔습니다."
				,messageMap.get("toUser"),messageMap.get("channelName")+" 채널에서 "+
				messageMap.get("fromUser")+"님이 메시지를 보냈습니다. 확인해주세요."+
						"\n 91cm로 이동 : http://91cm.nineonesoft.com:9191/");
		return true;
	}
	
	@RequestMapping(value = "/update/deleteyn", method = RequestMethod.POST)
	public boolean updateDeleteYN(@RequestBody Message msg) {
		return messageServie.updateDeleteYN(msg.getId());
	}

}
