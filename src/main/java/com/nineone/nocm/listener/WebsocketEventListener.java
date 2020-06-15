package com.nineone.nocm.listener;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Component
@Getter
@Slf4j
public class WebsocketEventListener {
	@Autowired
	private SimpMessageSendingOperations messagingTemplate;
	
	private Map<String,Object> sessions = new HashMap<>();
	
	public Map<String,Object> getOnlineSessions(){
		return this.sessions;
	}
	
	
	@EventListener
	public void handleWebSocketConnectListener(SessionConnectedEvent event) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
		Map<String,Object> headers = getNativeHeaders(headerAccessor);
		String userEmail = getUserEmail(headers);
		log.info(userEmail+"    ... connection");
		sessions.put(userEmail, headerAccessor.getSessionId());
		messagingTemplate.convertAndSend("/sub/sync/info", "getChannelUserList");
		log.info(event.getUser()+"    ... connection");
	}
//	
	@EventListener
	public void handleWebSocketDisConnectListener(SessionDisconnectEvent event) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
		log.info("... disconnection");
		
		String key = getKey(sessions,headerAccessor.getSessionId());
		log.info(key+"    ... disconnection");
		sessions.remove(key);
		messagingTemplate.convertAndSend("/sub/sync/info", "getChannelUserList");
	}
	
	public String getKey(Map<String, Object> map, String value) {
		 
        for (String key : map.keySet()) {
            if (value.equals(map.get(key))) {
                return key;
            }
        }
        return null;
    }
	
	@SuppressWarnings("unchecked")
	public Map<String,Object> getNativeHeaders(SimpMessageHeaderAccessor headerAccessor) {
		GenericMessage<?> simpConnectMessage = (GenericMessage<?>)headerAccessor.getMessageHeaders().get("simpConnectMessage");
		return (Map<String,Object>)simpConnectMessage.getHeaders().get("nativeHeaders");
	}
	
	@SuppressWarnings("unchecked")
	public String getUserEmail(Map<String,Object> headers) {
		List<String> list = (LinkedList<String>)headers.get("email");
		return list.get(0);
	}
//	public String getId(SimpMessageHeaderAccessor headerAccessor) {
//		User user = (User)headerAccessor.getSessionAttributes().get("user");
//		return user.getUserid();
//	}
	
}
