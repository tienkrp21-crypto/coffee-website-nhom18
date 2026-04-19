package com.nhom18.coffee.checkout.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.checkout.dto.CheckoutRequest;
import com.nhom18.coffee.checkout.dto.CheckoutResponse;
import com.nhom18.coffee.checkout.model.Order;
import com.nhom18.coffee.checkout.service.CheckoutService;
import com.nhom18.coffee.checkout.service.PayOSService;

@RestController
@RequestMapping("/checkout")
@CrossOrigin("*") 
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @Autowired
    private PayOSService payOSService;

    // 1. API Gửi thông tin giỏ hàng và đặt đơn
    @PostMapping
    public ResponseEntity<CheckoutResponse> processCheckout(@RequestBody CheckoutRequest request) {

        // Bước 1: Lưu đơn hàng vào Database
        Order savedOrder = checkoutService.createOrder(request);

        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(savedOrder.getId());

        // Bước 2: Xử lý theo phương thức thanh toán
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            response.setMessage("Đặt hàng thành công. Vui lòng thanh toán khi nhận hàng.");
            return ResponseEntity.ok(response);
            
        } else if ("PAYOS".equalsIgnoreCase(request.getPaymentMethod()) || "VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
            // Tạo link thanh toán PayOS (chứa mã VietQR)
            String paymentUrl = payOSService.createPaymentLink(savedOrder.getFinalAmount(), savedOrder.getOrderCode());
            
            if (paymentUrl != null) {
                response.setMessage("Vui lòng thanh toán qua link đính kèm.");
                response.setPaymentUrl(paymentUrl);
                return ResponseEntity.ok(response);
            } else {
                response.setMessage("Lỗi tạo mã thanh toán QR!");
                return ResponseEntity.badRequest().body(response);
            }
            
        } else {
            response.setMessage("Phương thức thanh toán không hợp lệ!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 2. API Hứng dữ liệu Webhook từ PayOS (Tương tự return url của vnpay nhưng chạy ngầm)
    @PostMapping("/payos-webhook")
    public ResponseEntity<?> payOSWebhook(@RequestBody String jsonBody) {
        
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        com.fasterxml.jackson.databind.node.ObjectNode response = mapper.createObjectNode();
        
        try {
            // Bước 1: Dùng thư viện JSON để lấy thông tin cơ bản trước
            vn.payos.type.Webhook webhookData = mapper.readValue(jsonBody, vn.payos.type.Webhook.class);

            // Lúc bạn bấm Lưu ở trang quản trị, PayOS gửi 1 giao dịch mẫu cấu hình. 
            // Ta không verify chữ ký cái test này để tránh cấu hình lỗi vòng lặp
            if (webhookData.getData() != null && webhookData.getData().getAmount() == 0) {
                response.put("error", 0);
                response.put("message", "Ok");
                response.put("data", "Webhook test OK");
                return ResponseEntity.ok(response);
            }

            // Bước 2: Với đơn hàng có tiền, ta verify chữ ký
            vn.payos.type.WebhookData data = payOSService.verifyWebhook(webhookData);

            if ("00".equals(data.getCode()) || "success".equalsIgnoreCase(data.getCode())) {
                
                Long orderCode = data.getOrderCode();
                
                // Cập nhật CSDL theo đúng orderCode PayOS vừa báo về
                checkoutService.updateOrderStatusByOrderCode(orderCode, 1, "PROCESSING");
                
                System.out.println("====== THANH TOÁN THÀNH CÔNG ĐƠN HÀNG CODE: " + orderCode + " ======");
            }

            response.put("error", 0);
            response.put("message", "Ok");
            response.set("data", null); // Set được null thoải mái
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", 0);
            response.put("message", "Bỏ qua lỗi: " + e.getMessage());
            response.set("data", null);
            return ResponseEntity.ok(response); // Trả về 200 OK để PayOS không báo lỗi 500
        }
    }
}