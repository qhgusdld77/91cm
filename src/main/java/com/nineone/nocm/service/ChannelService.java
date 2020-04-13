package com.nineone.nocm.service;

import java.util.List;

import com.nineone.nocm.domain.Channel;
import com.nineone.nocm.domain.JoinInfo;

public interface ChannelService {

	boolean createChannel(Channel channel);

    boolean deleteChannel(int id);

    List<Channel> channelList(String userId);

    boolean updateChannel(Channel name);

    List<Channel> channelListAll();
}
