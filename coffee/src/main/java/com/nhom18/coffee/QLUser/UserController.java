package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin("*") // Mở cửa cho Frontend gọi API không bị lỗi CORS
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmailService emailService;

    // 1. API LẤY DANH SÁCH NGƯỜI DÙNG (Dành cho Admin)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. API ĐĂNG KÝ TÀI KHOẢN MỚI
    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        // Kiểm tra xem email đã tồn tại chưa
        Optional<User> existingUser = userRepository.findByEmail(newUser.getEmail());
        if (existingUser.isPresent()) {
            return "Thất bại: Email này đã được đăng ký!";
        }

        // Mặc định khách hàng mới đăng ký sẽ có role_id = 2 (CUSTOMER) và status = 1 (Hoạt động)
        newUser.setRoleId(2);
        newUser.setStatus(1);

        userRepository.save(newUser);
        return "Thành công: Đăng ký tài khoản hoàn tất!";
    }

    // 3. API ĐĂNG NHẬP (TRẢ VỀ TOKEN JWT)
    @PostMapping("/login")
    public String login(@RequestBody User loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        // Kiểm tra xem có user không và mật khẩu có khớp không
        if (user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {

            // Nếu đúng, tạo ra một mã JWT xịn xò và trả về cho Frontend
            String token = jwtTokenUtil.generateToken(user.get().getEmail());
            return token;
        }

        return "Thất bại: Sai email hoặc mật khẩu!";
    }

    // 4. API QUÊN MẬT KHẨU (Bản nâng cấp: Gửi Link)
    @PostMapping("/forgot-password")
    public org.springframework.http.ResponseEntity<String> forgotPassword(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // Tạo 1 thẻ VIP sống 15 phút
            String resetToken = jwtTokenUtil.generateResetToken(email);

            // Ép cái thẻ VIP đó vào đuôi đường link trang web của Frontend
            String resetLink = "https://coffee-website-nhom18.vercel.app/reset-password?token=" + resetToken;

            // Gửi mail chứa link
            emailService.sendResetPasswordEmail(email, resetLink);

            return org.springframework.http.ResponseEntity.ok("Thành công: Đã gửi link đặt lại mật khẩu qua Email!");
        }

        return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Không tìm thấy tài khoản với Email này!");
    }

    // 5. API ĐẶT LẠI MẬT KHẨU (API MỚI - Frontend sẽ gọi hàm này khi khách gõ pass mới)
    @PostMapping("/reset-password")
    public org.springframework.http.ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            // Giải mã thẻ VIP xem của ai. Nếu token hết 15 phút, nó sẽ báo lỗi văng xuống block catch!
            String email = jwtTokenUtil.extractEmailFromToken(token);
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(newPassword); // Cập nhật mật khẩu mới khách vừa gõ
                userRepository.save(user);
                return org.springframework.http.ResponseEntity.ok("Thành công: Đặt lại mật khẩu hoàn tất!");
            }
            return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Không tìm thấy người dùng!");

        } catch (Exception e) {
            // Bắt lỗi nếu Token bị sửa bậy bạ hoặc đã quá 15 phút
            return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Đường link đã hết hạn hoặc không hợp lệ! Vui lòng gửi lại yêu cầu.");
        }
    }
}