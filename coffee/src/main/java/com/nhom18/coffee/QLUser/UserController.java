package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Dùng để băm và kiểm tra mật khẩu

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    // --- CẬP NHẬT THÔNG TIN CÁ NHÂN ---
    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setStatus(userDetails.getStatus());
            user.setRoleId(userDetails.getRoleId());
            // Chỉ cập nhật mật khẩu nếu Frontend có gửi mật khẩu mới và đã được băm
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            return userRepository.save(user);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }

    // --- ĐĂNG KÝ (CÓ BĂM MẬT KHẨU) ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Thất bại: Email này đã được đăng ký!");
        }

        // BẮT BUỘC: Băm mật khẩu trước khi lưu vào Database
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getStatus() == null) user.setStatus(1);
        if (user.getRoleId() == null) user.setRoleId(2);

        userRepository.save(user);
        return ResponseEntity.ok("Thành công: Đăng ký tài khoản hoàn tất!");
    }

    // --- ĐĂNG NHẬP (TRẢ VỀ OBJECT USER ĐỂ HIỆN TRANG CÁ NHÂN) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        Optional<User> userOpt = userRepository.findByEmail(loginData.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Kiểm tra mật khẩu nhập vào với mật khẩu đã băm trong DB
            if (passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
                user.setPassword(null); // Bảo mật: Không gửi mật khẩu về Frontend
                return ResponseEntity.ok(user); // Trả về cả Object User để Frontend lấy ID, Name...
            }
        }

        // Trả về 401 để Frontend biết là sai thông tin và chặn không cho vào trang chủ
        return ResponseEntity.status(401).body("Thất bại: Sai email hoặc mật khẩu!");
    }
}