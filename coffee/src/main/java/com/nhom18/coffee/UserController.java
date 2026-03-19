package com.nhom18.coffee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // --- R: READ (Lấy toàn bộ danh sách User) ---
    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // --- R: READ (Lấy thông tin User theo ID) ---
    @GetMapping("/{id}")
    public User getOne(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    // --- C: CREATE (Thêm mới một User) ---
    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    // --- U: UPDATE (Cập nhật thông tin User theo ID) ---
    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            // Cập nhật trường name dựa theo User.java bạn đã cung cấp
            user.setName(userDetails.getName());
            return userRepository.save(user);
        }).orElse(null);
    }

    // --- D: DELETE (Xóa User theo ID) ---
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }
}