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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác nhận đổi mật khẩu - CAFE MATERIAL");
        message.setText("Chào bạn,\n\n"
                + "Bạn vừa yêu cầu đổi mật khẩu tại hệ thống Cafe Material.\n"
                + "Mã xác nhận (OTP) của bạn là: " + otpCode + "\n\n"
                + "Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai!\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ Cafe Material.");

        mailSender.send(message);
    }
}