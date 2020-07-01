package com.nineone.nocm.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.nineone.nocm.domain.User;
import com.nineone.nocm.oauth.OAuthAttributes;
import com.nineone.nocm.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomOAuthUserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final HttpSession httpSession;
    private final UserRepository userRepository;

    @SuppressWarnings({"rawtypes", "unchecked"})
	@Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService delegate = new DefaultOAuth2UserService();
		OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();
        OAuthAttributes attributes = OAuthAttributes.Of(registrationId, userNameAttributeName,
                oAuth2User.getAttributes());
        User user = saveOrUpdate(attributes);
        user.setPassword(null);
        httpSession.setAttribute("user", user);
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new DefaultOAuth2User(
                list,
                attributes.getAttributes(),
                attributes.getNameAttributeKey());
    }

    private User saveOrUpdate(OAuthAttributes attributes) {
        // 임시 setter로 저장 해준 값은 소셜 로그인을 통해서 가져올 수 없는 값
        // 사용자에게 값을 받거나 해서 지정 해줘야 함으로 지금은 임시로 지정
    	User user;
        if(attributes.getEmail()==null) {
        	user = userRepository.getUserfindById(attributes.getId());
        }
        else {
        	user = userRepository.getUserfindByEmail(attributes.getEmail());
        }    	
        if (user == null) {
            user = attributes.toEntity();
        }
        return user;
    }
}