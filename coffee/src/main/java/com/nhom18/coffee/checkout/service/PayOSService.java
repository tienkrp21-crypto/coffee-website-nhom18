package com.nhom18.coffee.checkout.service;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@Service
public class PayOSService {

    @Value("${payos.clientId}")
    private String clientId;

    @Value("${payos.apiKey}")
    private String apiKey;

    @Value("${payos.checksumKey}")
    private String checksumKey;

    private static final String returnUrl = "http://localhost:3000/thanh-toan-thanh-cong"; 
    private static final String cancelUrl = "http://localhost:3000/thanh-toan-huy";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private PayOS payOS;

    public String createPaymentLink(Integer totalAmount, Long orderCode) {
        try {
            String description = "Đơn hàng " + orderCode;
            
            // Tính toán thời gian hết hạn sau 10 phút (Unix timestamp theo giây)
            long expiredAt = (System.currentTimeMillis() / 1000) + (10 * 60);

            // BÍ QUYẾT: Theo chuẩn PayOS V2, chuỗi băm bảo mật (Signature) CHỈ BAO GỒM 5 trường cơ bản này.
            // KHÔNG đưa expiredAt vào chuỗi signData, nếu không chữ ký sẽ bị lỗi (dẫn đến data = null).
            String signData = "amount=" + totalAmount
                    + "&cancelUrl=" + cancelUrl
                    + "&description=" + description
                    + "&orderCode=" + orderCode
                    + "&returnUrl=" + returnUrl;

            // Tạo Signature hash HMAC SHA256 chuẩn
            String signature = generateHmacSHA256(signData, checksumKey);

            // Cấu hình Body gửi lên PayOS (lúc này mới cấu hình tham số thời gian)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("orderCode", orderCode);
            requestBody.put("amount", totalAmount);
            requestBody.put("description", description);
            requestBody.put("returnUrl", returnUrl);
            requestBody.put("cancelUrl", cancelUrl);
            requestBody.put("signature", signature);
            requestBody.put("expiredAt", (int) expiredAt); // Băm ra Integer rồi nhét riêng vào HTTP JSON body

            // Cấu hình Headers (Chìa khóa để PayOS cấp phép kết nối)
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("x-client-id", clientId);
            headers.set("x-api-key", apiKey);

            // Gọi Post thủ công đến PayOS Server
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api-merchant.payos.vn/v2/payment-requests",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Đọc kết quả Json trả về
            JsonNode rootNode = mapper.readTree(response.getBody());
            
            // Dễ dàng check nếu lỡ sau này config sai
            if (!rootNode.path("code").asText().equals("00")) {
                System.err.println("Lỗi gọi thư viện PayOS tạo link: " + rootNode.path("desc").asText());
                return null;
            }

            return rootNode.path("data").path("checkoutUrl").asText();

        } catch (Exception e) {
            System.err.println("Lỗi vòng ngoài khi tạo link PayOS: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String generateHmacSHA256(String data, String key) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        
        byte[] hash = sha256_HMAC.doFinal(data.getBytes("UTF-8"));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public WebhookData verifyWebhook(Webhook webhookData) throws Exception {
        return payOS.verifyPaymentWebhookData(webhookData);
    }

    public boolean cancelPaymentLink(Long orderCode, String cancellationReason) {
        try {
            vn.payos.type.PaymentLinkData result = payOS.cancelPaymentLink(orderCode, cancellationReason);
            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi hủy link PayOS: " + e.getMessage());
            return false;
        }
    }
}