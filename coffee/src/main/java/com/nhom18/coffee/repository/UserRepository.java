package com.nhom18.coffee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Hàm này cực kỳ quan trọng cho Đăng ký & Đăng nhập
    Optional<User> findByEmail(String email);
}