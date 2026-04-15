package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    @Value("${google.script.url}")
    private String googleScriptUrl;
    public void sendOtpEmail(String toEmail, String otpCode) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("to", toEmail);
        body.put("subject", "Mã OTP Xác Nhận Quên Mật Khẩu");
        body.put("body", "Xin chào,\n\nMã OTP của bạn là: " + otpCode + "\nMã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho ai!");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(googleScriptUrl, request, String.class);
            System.out.println("Đã gửi mail THẬT qua Google Apps Script!");
        } catch (Exception e) {
            System.out.println("Lỗi gửi mail: " + e.getMessage());
        }
    }
}