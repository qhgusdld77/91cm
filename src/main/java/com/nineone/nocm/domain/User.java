package com.nineone.nocm.domain;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class User{
    private String name;
    private String phone;
    private String email;
    private String picture;
    private List<String> roles;
    private boolean isOnline;
    private String password;

    @Builder
    public User(String name, String phone, String picture, String email, String password,
                List<String> roles) {
        this.name = name;
        this.phone = phone;
        this.picture = picture; 
        this.email = email;
        this.roles = roles;
        this.password = password;
        
    }

    public User update(String name, String icon) {
        this.name = name;
        this.picture = icon;
        return this;
    }
    
//    public void setPicture(String picture) {
//    	if(picture == null) {
//    		this.picture = "@/assets/images/default-user-picture.png";
//    	}else {
//    		this.picture = picture;
//    	}
//    }

}
