package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.UserDTO;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Integer id);
    UserDTO createUser(UserDTO userDTO); // Optional admin method if different from register
    UserDTO updateUser(Integer id, UserDTO userDTO);
    void deleteUser(Integer id);
    
    // Auth operations
    String register(UserDTO userDTO);
    String login(UserDTO loginData);
}
