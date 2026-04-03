package com.nhom18.coffee.QLUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            // Cập nhật các trường mới
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
}