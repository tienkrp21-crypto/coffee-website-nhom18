package com.nhom18.coffee.checkout.controller;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.checkout.dto.CheckoutRequest;
import com.nhom18.coffee.checkout.dto.CheckoutResponse;
import com.nhom18.coffee.checkout.model.Order;
import com.nhom18.coffee.checkout.service.CheckoutService;
import com.nhom18.coffee.checkout.service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/checkout")
@CrossOrigin("*") // Cho phép Frontend gọi API mà không bị lỗi CORS
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @Autowired
    private VNPayService vnPayService;

    // 1. API Gửi thông tin giỏ hàng và đặt đơn
    @PostMapping
    public ResponseEntity<CheckoutResponse> processCheckout(
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {

        // Bước 1: Lưu đơn hàng vào Database (Trạng thái mặc định là PENDING và UNPAID)
        Order savedOrder = checkoutService.createOrder(request);

        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(savedOrder.getId());

        // Bước 2: Xử lý theo phương thức thanh toán
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            // Nếu là trả tiền mặt, chỉ cần báo thành công
            response.setMessage("Đặt hàng thành công. Vui lòng thanh toán khi nhận hàng.");
            return ResponseEntity.ok(response);
            
        } else if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
            // Nếu là VNPay, tạo link Sandbox và gửi về cho Frontend để FE tự chuyển hướng user
            String ipAddress = getIpAddress(httpRequest);
            String paymentUrl = vnPayService.createOrderUrl(savedOrder.getFinalAmount(), savedOrder.getId(), ipAddress);
            
            response.setMessage("Vui lòng thanh toán qua link VNPay đính kèm.");
            response.setPaymentUrl(paymentUrl);
            return ResponseEntity.ok(response);
            
        } else {
            response.setMessage("Phương thức thanh toán không hợp lệ!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 2. API Hứng dữ liệu VNPay trả về (Return URL)
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        // Lấy tất cả các parameter mà VNPay gửi về
        Map<String, String> fields = new HashMap<>();
        Enumeration<String> params = request.getParameterNames();
        while (params.hasMoreElements()) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue);
            }
        }

        // Lấy mã bảo mật và validate chữ ký
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        boolean isSignValid = vnPayService.validateSignature(fields, vnp_SecureHash);

        if (!isSignValid) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ / Sai chữ ký VNPay");
        }

        // Nếu chữ ký chuẩn, kiểm tra trạng thái thanh toán
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        Integer orderId = Integer.parseInt(request.getParameter("vnp_TxnRef"));

        if ("00".equals(vnp_ResponseCode)) {
            // 00 là mã thành công của VNPay
            checkoutService.updateOrderStatus(orderId, 1, "PROCESSING"); // 1 = PAID
            return ResponseEntity.ok("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
        } else {
            // Thanh toán lỗi hoặc khách hàng hủy thanh toán
            checkoutService.updateOrderStatus(orderId, 2, "CANCELLED"); // 2 = FAILED
            checkoutService.restoreStock(orderId);
            return ResponseEntity.badRequest().body("Thanh toán thất bại hoặc đã bị hủy.");
        }
    }

    // Hàm phụ trợ để lấy IP Address của người dùng (VNPay yêu cầu phải có)
    private String getIpAddress(HttpServletRequest request) {
        String ipAdress = request.getHeader("X-FORWARDED-FOR");
        if (ipAdress == null) {
            ipAdress = request.getRemoteAddr();
        }
        return ipAdress;
    }
}