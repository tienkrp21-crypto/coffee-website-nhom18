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

    // 4. API QUÊN MẬT KHẨU (GỬI MAIL CẤP LẠI)
    @PostMapping("/forgot-password")
    public org.springframework.http.ResponseEntity<String> forgotPassword(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Tạo 1 mật khẩu ngẫu nhiên gồm 6 ký tự
            String newPassword = UUID.randomUUID().toString().substring(0, 6);

            // Lưu mật khẩu mới vào Database
            user.setPassword(newPassword);
            userRepository.save(user);

            // Gọi anh "Bưu tá" đi giao thư chứa mật khẩu mới
            emailService.sendNewPasswordEmail(email, newPassword);

            // Trả về mã 200 (OK)
            return org.springframework.http.ResponseEntity.ok("Thành công: Đã gửi mật khẩu mới qua Email của bạn!");
        }

        // Trả về mã 400 (Bad Request) để báo lỗi cho Frontend
        return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Không tìm thấy tài khoản với Email này!");
    }
}