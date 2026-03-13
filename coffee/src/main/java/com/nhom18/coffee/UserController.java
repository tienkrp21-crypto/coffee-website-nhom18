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

    @GetMapping
    public List<User> getAll() { return userRepository.findAll(); }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }
}