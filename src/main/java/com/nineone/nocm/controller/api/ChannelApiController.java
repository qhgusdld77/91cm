package com.nineone.nocm.controller.api;

import com.nineone.nocm.annotation.Socialuser;
import com.nineone.nocm.domain.Channel;
import com.nineone.nocm.domain.User;
import com.nineone.nocm.service.ChannelService;
import com.nineone.nocm.service.JoinInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/channel")
public class ChannelApiController {

    @Autowired
    private ChannelService channelService;

    @Autowired
    private JoinInfoService joinInfoService;

    @PostMapping("/current")
    public Channel getCurrentChannel(@RequestBody Channel channel){
        return channelService.getCurrentChannel(channel);
    }

    @PostMapping("/leave")
    public boolean leaveChannel(@RequestBody Map<String, Object> info){
        // info에는 해당 유저의 email 값과 채널 id값이 들어 있음 -> key : (email , channel_id)
    	// leaveUser(mapper)를   joininfo테이블에 있는 가입 정보 뿐만 아니라 초대 정보까지 지우는 쿼리로 수정함.
        return joinInfoService.leaveUser(info);
    }

    @GetMapping("/all")
    public List<Channel> channelListAll(){
        return channelService.channelListAll();
    }

    // 사용자의 채널 리스트를 반환
    @GetMapping("/list")
    public List<Channel> channelList(@Socialuser User user) {
        return channelService.channelList(user.getEmail());
    }

    @PostMapping("/create")
    public Channel createChannel(@RequestBody Map<String, String> channelInfo) {
        Channel channel = Channel.builder()
                .name(channelInfo.get("name"))
                .member_email(channelInfo.get("member_email"))
                .build();
        channelService.createChannel(channel);
        return channel;
    }

    @PostMapping("/update")
    public boolean updateChannel(@RequestBody Channel channel, @Socialuser User user) {
         return channelService.updateChannel(channel);
    }

    @PostMapping("/delete")
    public boolean deleteChannel(@RequestBody Channel channel) {
        return channelService.deleteChannel(channel.getId());
    }

    @RequestMapping(value ="/update/lastaccessdate", method=RequestMethod.PUT)
    public void updateLastAccessDate(@RequestBody Map<String,Object> map) {
    	if(map.get("oldChannelId")==null) {
    		joinInfoService.updateLastAccessDate((int)map.get("currentChannelId"),map.get("userEmail").toString());
    	}else {
    		joinInfoService.updateLastAccessDate((int)map.get("oldChannelId"),map.get("userEmail").toString());
    	}
    }

}
