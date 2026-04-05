package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendNewPasswordEmail(String toEmail, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yêu cầu cấp lại mật khẩu - Coffee Nhóm 18");
        message.setText("Chào bạn,\n\nMật khẩu mới của bạn là: " + newPassword + "\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay nhé!");

        mailSender.send(message);
    }
}