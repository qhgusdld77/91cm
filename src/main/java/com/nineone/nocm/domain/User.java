package com.nineone.nocm.domain;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Collection;
import java.util.List;

@Getter
@NoArgsConstructor
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private String name;
    private String phone;
    private String email;
    private String picture;
    private List<String> roles;
    private boolean isOnline;

    @Builder
    public User(String name, String phone, String picture, String email, String password,
                List<String> roles) {
        this.name = name;
        this.phone = phone;
        this.picture = picture; 
        this.email = email;
        this.roles = roles;
        
    }

    public User update(String name, String icon) {
        this.name = name;
        this.picture = icon;
        return this;
    }

}
