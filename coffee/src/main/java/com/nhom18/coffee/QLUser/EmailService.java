package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yêu cầu đặt lại mật khẩu - Xutore");
        message.setText("Chào bạn,\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào đường link dưới đây để tạo mật khẩu mới (Link chỉ có hiệu lực trong 15 phút):\n\n"
                + resetLink + "\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.");

        mailSender.send(message);
    }
}