package com.nineone.nocm.controller.websocket;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.nineone.nocm.domain.ApiResponse;
import com.nineone.nocm.domain.Message;
import com.nineone.nocm.service.MessageService;
import com.nineone.nocm.util.DateUtil;

@Controller
public class MessageController {

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	@Autowired
	private MessageService messageService;

	@MessageMapping("/chat/message")
	@Transactional
	public void message(Message message)throws ParseException {
		message.setSend_date(DateUtil.makeDate());
		message.setStr_send_date(messageService.makeStrDate(message.getSend_date()));
		
		String formatDate = new SimpleDateFormat("yyyy년 MM월 dd일 E요일").format(message.getSend_date());
		if(messageService.isFirstMsgToday(formatDate, message.getChannel_id())) {
			Message dateMessage = message.clone();
			dateMessage.setContent(formatDate);
			dateMessage.setMessage_type("date");
			messageService.insertMessage(dateMessage);
			messagingTemplate.convertAndSend("/sub/chat/room/"+dateMessage.getChannel_id(), dateMessage);
		}
			
		// sender가 null이면 시스템메시지이기 때문에.
		if(message.getSender()!=null) {
			message.setContent(messageService.replacemsg(message.getContent()));
		}
		
		if(messageService.insertMessage(message) > 0) {
			messagingTemplate.convertAndSend("/sub/chat/room/"+message.getChannel_id(), message);
		}else {
			messagingTemplate.convertAndSend("/sub/"+message.getSender(), message);
		}
	}
	@MessageMapping("/sync/info")
	public void storeUpdateMessage(){
		messagingTemplate.convertAndSend("/sub/sync/info","true");
	}

	@MessageMapping("/chat/room/{id}")
	public void syncMessage(@DestinationVariable String id, @Payload ApiResponse apiResponse)throws Exception{
		messagingTemplate.convertAndSend("/sub/chat/room/"+id,apiResponse);
	}
}