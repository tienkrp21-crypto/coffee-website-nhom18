package com.nhom18.coffee.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.dto.UserDTO;
import com.nhom18.coffee.entity.User;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.UserRepository;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return mapToDTO(user);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // Kiểm tra xem email đã tồn tại trong Database chưa
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }

        User user = mapToEntity(userDTO);
        
        // Gán role và status mặc định nếu trống (hoặc có thể setup trong register)
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        if (user.getRoleId() == null) {
            user.setRoleId(2); // Mặc định là user thường (Role Customer)
        }

        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(Integer id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        existingUser.setFullName(userDTO.getFullName());
        existingUser.setPhone(userDTO.getPhone());
        
        // Chỉ cập nhật mật khẩu nếu có gửi lên (not null và not empty)
        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword(userDTO.getPassword());
        }
        
        if (userDTO.getStatus() != null) {
            existingUser.setStatus(userDTO.getStatus());
        }
        
        if(userDTO.getRoleId() != null) {
            existingUser.setRoleId(userDTO.getRoleId());
        }

        User updatedUser = userRepository.save(existingUser);
        return mapToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Integer id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        
        // Xóa mềm: đổi status thành 0 hoặc cờ isDeleted (tuỳ cấu trúc DB, ở đây mượn `status`)
        // Nếu DB không yêu cầu xóa mềm, có thể userRepository.deleteById(id);
        userRepository.deleteById(existingUser.getId());
    }

    @Override
    public String register(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            return "Thất bại: Email này đã được đăng ký!";
        }

        User user = mapToEntity(userDTO);
        if (user.getStatus() == null) {
            user.setStatus(1); // 1 = Tài khoản đang hoạt động
        }
        if (user.getRoleId() == null) {
            user.setRoleId(2); // Giả sử 2 là quyền Khách hàng (Customer)
        }

        userRepository.save(user);
        return "Thành công: Đăng ký tài khoản hoàn tất!";
    }

    @Override
    public String login(UserDTO loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {
            // (Hiện tại trả về chữ, sau này sẽ nâng cấp lên JWT)
            // Lưu ý logic thực tế nên check password được mã hóa BCrypt
            return "Thành công: Đăng nhập hợp lệ!";
        }

        return "Thất bại: Sai email hoặc mật khẩu!";
    }

    // --- Helper Methods to map between DTO and Entity ---
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setRoleId(user.getRoleId());
        dto.setStatus(user.getStatus());
        // Bảo mật: không nên gửi password về frontend nếu không cần thiết
        dto.setPassword(null); 
        // dto.setCreatedAt(user.getCreatedAt()); // Bỏ qua / gán nốt tuỳ bạn
        return dto;
    }

    private User mapToEntity(UserDTO dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setRoleId(dto.getRoleId());
        user.setStatus(dto.getStatus());
        return user;
    }
}