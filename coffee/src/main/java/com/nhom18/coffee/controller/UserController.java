package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.ApiResponse;
import com.nhom18.coffee.dto.UserDTO;
import com.nhom18.coffee.service.UserService;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;

@Hidden
@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- CÁC HÀM CŨ CỦA BẠN (GIỮ NGUYÊN) ---
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> create(@Valid @RequestBody UserDTO userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Tạo người dùng thành công", userService.createUser(userDetails)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> update(@PathVariable Integer id, @Valid @RequestBody UserDTO userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật người dùng thành công", userService.updateUser(id, userDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa người dùng thành công", null));
    }

    // ==========================================
    // --- TASK 1: CHỨC NĂNG ĐĂNG KÝ & ĐĂNG NHẬP ---
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody UserDTO userDTO) {
        String message = userService.register(userDTO);
        if (message.startsWith("Thất bại")) {
            return ResponseEntity.badRequest().body(ApiResponse.error(message)); // 400 Bad Request
        }
        return ResponseEntity.ok(ApiResponse.success(message, null)); // 200 OK
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody UserDTO loginData) {
        String message = userService.login(loginData);
        if (message.startsWith("Thất bại")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(message)); // 401 Unauthorized
        }
        return ResponseEntity.ok(ApiResponse.success(message, null)); // 200 OK
    }
}