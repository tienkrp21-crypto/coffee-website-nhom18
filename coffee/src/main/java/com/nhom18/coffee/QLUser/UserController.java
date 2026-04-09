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

    // API 1: Bấm nút "Lấy mã" -> Trả về một cái Token (chứa OTP) cho Frontend giữ
    @CrossOrigin("*")
    @PostMapping("/forgot-password/send-otp")
    public org.springframework.http.ResponseEntity<String> sendOtp(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // Random ra 6 số ngẫu nhiên
            String otpCode = String.format("%06d", new java.util.Random().nextInt(999999));

            // Gửi 6 số đó vào mail cho khách
            emailService.sendOtpEmail(email, otpCode);

            // Gói 6 số đó vào 1 cái Token, ném về cho Frontend cất giữ
            String token = jwtTokenUtil.generateOtpToken(email, otpCode);

            // Trả về Token cho Frontend (Dặn FE phải lưu cái này lại)
            return org.springframework.http.ResponseEntity.ok(token);
        }

        return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Email chưa được đăng ký!");
    }

    // API 2: Bấm nút "Xác nhận đổi MK" -> Frontend gửi cả Mã OTP khách gõ + Cái Token lúc nãy lên
    @CrossOrigin("*")
    @PostMapping("/forgot-password/confirm-otp")
    public org.springframework.http.ResponseEntity<String> confirmOtp(
            @RequestParam String token,
            @RequestParam String userInputOtp,
            @RequestParam String newPassword) {
        try {
            // Mở khóa Token ra
            io.jsonwebtoken.Claims claims = jwtTokenUtil.extractAllClaims(token);
            String email = claims.getSubject();
            String realOtp = claims.get("otp", String.class); // Lấy mã thật từ trong thẻ

            // So sánh mã khách gõ với mã thật
            if (!realOtp.equals(userInputOtp)) {
                return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Mã OTP không chính xác!");
            }

            // Nếu đúng -> Lưu mật khẩu mới
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(newPassword);
                userRepository.save(user);
                return org.springframework.http.ResponseEntity.ok("Thành công: Đã đổi mật khẩu!");
            }
            return org.springframework.http.ResponseEntity.badRequest().body("Lỗi hệ thống: Không tìm thấy user!");

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Mã OTP đã hết hạn 5 phút. Vui lòng lấy mã mới!");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body("Thất bại: Dữ liệu không hợp lệ!");
        }
    }
    // 4. API LẤY THÔNG TIN PROFILE QUA TOKEN
    @CrossOrigin("*")
    @GetMapping("/profile")
    public org.springframework.http.ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String bearerToken) {
        try {
            // Frontend gửi lên có chữ "Bearer " ở đầu, nên phải cắt bỏ 7 ký tự đầu tiên để lấy đúng Token
            String token = bearerToken.substring(7);

            // Giải mã Token để lấy Email
            io.jsonwebtoken.Claims claims = jwtTokenUtil.extractAllClaims(token);
            String email = claims.getSubject();

            // Lấy thông tin User từ Database
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                // Trả về toàn bộ thông tin User (để FE tự lấy fullName, phone, email...)
                return org.springframework.http.ResponseEntity.ok(userOptional.get());
            }

            return org.springframework.http.ResponseEntity.badRequest().body("Lỗi: Không tìm thấy người dùng!");

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return org.springframework.http.ResponseEntity.status(401).body("Lỗi: Phiên đăng nhập đã hết hạn!");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(401).body("Lỗi: Token không hợp lệ!");
        }
    }
}