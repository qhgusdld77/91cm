package com.nineone.nocm.service;

import java.util.List;
import java.util.Map;

import com.nineone.nocm.repository.CommonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nineone.nocm.domain.Channel;
import com.nineone.nocm.domain.JoinInfo;
import com.nineone.nocm.repository.ChannelRepository;
import com.nineone.nocm.repository.MessageRepository;

@Service
public class ChannelServiceImpl implements ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Override
    @Transactional
    public boolean createChannel(Channel channel) {
    	channelRepository.insertChannel(channel);
    	JoinInfo joinInfo = JoinInfo.builder()
    			.channel_id(channel.getId())
    			.member_email(channel.getMember_email())
    			.build();
        return (channelRepository.joinInfo(joinInfo) > 0 ) ? true : false;
    }

    @Override
    public boolean deleteChannel(int id) {
        return (channelRepository.deleteChannel(id) > 0) ? true : false;
    }

    @Override
    public List<Channel> channelList(String userEmail) {
//    	List<Channel> channelList = channelRepository.channelList(userEmail);
//    	
//    	
//    	if(channelList.size()>0) {
//    		List<Integer> countList = messageRepository.getMsgCntList(channelList);
//        	for(int i=0;i<channelList.size();i++) {
//        		channelList.get(i).setCount(countList.get(i));
//        	}
//    	}
        return channelRepository.channelList(userEmail);
    }

    @Override
    public boolean updateChannel(Channel channel) {
        return (channelRepository.updateChannel(channel) > 0) ? true : false;
    }
}
