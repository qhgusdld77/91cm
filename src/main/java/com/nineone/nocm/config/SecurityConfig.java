package com.nineone.nocm.config;


import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CharacterEncodingFilter;

import com.nineone.nocm.service.CustomOAuthUserService;
import com.nineone.nocm.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final HttpSession httpSession;
    private final CustomOAuthUserService customOAuthUserService;
    private final UserService userService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        http
                .addFilterBefore(filter, CsrfFilter.class)
//                .csrf().disable()
                .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()
                .headers().frameOptions().disable()
                .and()
                .authorizeRequests()
//                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll() //개발 임시 설정
                .antMatchers("/", "/css/**", "/js/**", "/img/**", "/login/**", "/oauth2/**", "/api/**", "/endpoint/**").permitAll()
                .anyRequest().authenticated()
                .and()
//	            .cors()
//	            .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .and()
                .oauth2Login()
                .defaultSuccessUrl("/main")
                .loginPage("/")
                .userInfoEndpoint().userService(customOAuthUserService);

    }
//	  @Bean
//	  public CorsConfigurationSource corsConfigurationSource() {
//	      CorsConfiguration configuration = new CorsConfiguration();
//	      // - (3)
//	      configuration.addAllowedOrigin("*");
//	      configuration.addAllowedMethod("*");
//	      configuration.addAllowedHeader("*");
//	      configuration.setAllowCredentials(true);
//	      configuration.setMaxAge(3600L);
//	      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//	      source.registerCorsConfiguration("/**", configuration);
//	      return source;
//	  }
}
