package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- API 1: GỬI MÃ OTP ---
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email chưa được đăng ký trong hệ thống!");
        }

        User user = userOpt.get();

        // 1. Tạo ngẫu nhiên mã OTP 6 số
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(otp);

        // 2. Set thời gian hết hạn là 5 phút bằng LocalDateTime (Để chuẩn múi giờ trên Render)
        user.setOtpExpiry(Timestamp.valueOf(LocalDateTime.now().plusMinutes(5)));

        // 3. Lưu vào DB
        userRepository.save(user);

        // 4. Bắn email qua Google Apps Script
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok("Đã gửi mã OTP. Vui lòng kiểm tra email!");
    }

    // --- API 2: XÁC NHẬN VÀ ĐỔI MẬT KHẨU ---
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otpCode");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi dữ liệu: Không tìm thấy tài khoản!");
        }

        User user = userOpt.get();

        // 1. Kiểm tra mã OTP khớp không
        if (user.getOtpCode() == null || !user.getOtpCode().equals(otpCode)) {
            return ResponseEntity.badRequest().body("Mã OTP không hợp lệ hoặc bạn chưa yêu cầu lấy mã!");
        }

        // 2. Kiểm tra mã OTP hết hạn chưa (So sánh với giờ hiện tại của hệ thống)
        if (user.getOtpExpiry().before(Timestamp.valueOf(LocalDateTime.now()))) {
            return ResponseEntity.badRequest().body("Mã OTP đã hết hạn, vui lòng lấy mã mới!");
        }

        // 3. Cập nhật mật khẩu mới (Đã băm BCrypt)
        user.setPassword(passwordEncoder.encode(newPassword));
        
        // 4. Reset thông tin OTP về null sau khi dùng xong
        user.setOtpCode(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
    }
}