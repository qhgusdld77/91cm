package com.nineone.nocm.oauth;

import java.util.Map;

import com.nineone.nocm.domain.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@SuppressWarnings("unchecked")
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String id;
    private String name;
    private String email;
    private String picture;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String id, String nameAttributeKey, String name,
                           String email, String picture){
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
    }

    public static OAuthAttributes Of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        if ("naver".equals(registrationId)) return ofNaver("id",attributes);
        if ("kakao".equals(registrationId)) return ofKakao(userNameAttributeName,attributes);
        if ("github".equals(registrationId)) return OfGithub(userNameAttributeName,attributes);
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes OfGithub(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .id(String.valueOf(attributes.get("id")))
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("avatar_url"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofKakao(String id, Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return OAuthAttributes.builder()
                .name((String) response.get("nickname"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .nameAttributeKey("code")
                .build();
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .id((String) attributes.get("sub"))
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

	private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return OAuthAttributes.builder()
                .id((String) response.get("id"))
                .name((String) response.get("name"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public User toEntity(){
        return User.builder()
                .name(name)
                .email(email)
                .picture(picture)
                .build();
    }
}