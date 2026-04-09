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

import com.nhom18.coffee.dto.UserDTO;
import com.nhom18.coffee.service.UserService;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;

@Hidden
@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- CÁC HÀM CŨ CỦA BẠN (GIỮ NGUYÊN) ---
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@Valid @RequestBody UserDTO userDetails) {
        return new ResponseEntity<>(userService.createUser(userDetails), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Integer id, @Valid @RequestBody UserDTO userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // --- TASK 1: QUẢN LÝ NGƯỜI DÙNG (ADMIN) ---
    // ==========================================

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/toggle")
    public ResponseEntity<String> toggleStatus(@PathVariable Integer id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok("Đã thay đổi trạng thái hoạt động của tài khoản!");
    }
}