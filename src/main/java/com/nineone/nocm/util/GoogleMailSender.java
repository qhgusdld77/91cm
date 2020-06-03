package com.nineone.nocm.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GoogleMailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void MailSend(String title, String toUser, String content){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("91softmanagement@gmail.com");
        message.setTo(toUser);
        message.setSubject(title);
        message.setText(content);
        mailSender.send(message);
    }

}
