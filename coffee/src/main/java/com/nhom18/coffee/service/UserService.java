package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.UserDTO;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Integer id);
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(Integer id, UserDTO userDTO);
    void deleteUser(Integer id);
    void toggleUserStatus(Integer id);
}
