package com.nhom18.coffee.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.entity.User;
import com.nhom18.coffee.repository.UserRepository;

import io.swagger.v3.oas.annotations.Hidden;


@Hidden
@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // --- CÁC HÀM CŨ CỦA BẠN (GIỮ NGUYÊN) ---
    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setPassword(userDetails.getPassword());
            user.setStatus(userDetails.getStatus());
            user.setRoleId(userDetails.getRoleId());
            return userRepository.save(user);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }

    // ==========================================
    // --- TASK 1: CHỨC NĂNG ĐĂNG KÝ & ĐĂNG NHẬP ---
    // ==========================================

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // 1. Kiểm tra xem email đã tồn tại trong Database chưa
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Thất bại: Email này đã được đăng ký!";
        }

        // 2. Gán giá trị mặc định cho User mới (nếu Frontend không gửi lên)
        if (user.getStatus() == null) {
            user.setStatus(1); // 1 = Tài khoản đang hoạt động
        }
        if (user.getRoleId() == null) {
            user.setRoleId(2); // Giả sử 2 là quyền Khách hàng (Customer)
        }

        // 3. Lưu vào Database
        userRepository.save(user);
        return "Thành công: Đăng ký tài khoản hoàn tất!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginData) {
        // 1. Tìm user theo email
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        // 2. Kiểm tra nếu tìm thấy user VÀ mật khẩu nhập vào khớp với DB
        if (user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {
            // (Hiện tại trả về chữ, sau này sẽ nâng cấp lên trả về mã JWT theo yêu cầu của Lead)
            return "Thành công: Đăng nhập hợp lệ!";
        }

        // 3. Nếu sai email hoặc mật khẩu
        return "Thất bại: Sai email hoặc mật khẩu!";
    }
}