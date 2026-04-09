package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác nhận Đặt lại mật khẩu - Xutore");
        message.setText("Chào bạn,\n\nMã xác nhận (OTP) để đặt lại mật khẩu của bạn là: "
                + otpCode + "\n\nMã này chỉ có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.");

        mailSender.send(message);
    }
}