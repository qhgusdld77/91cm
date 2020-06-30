package com.nineone.nocm.domain;

import java.util.Date;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Channel {
    private int id;
    private String name;
    private Date register_date;
    private String member_email;//채널 생성자
    private String login_email; //현재 로그인 유저
    private int count;

    @Builder
    public Channel(int id, String name, Date register_date, String member_email,int count){
        this.id = id;
        this.name = name;
        this.register_date = register_date;
        this.member_email = member_email;
        this.count = count;
    }
}