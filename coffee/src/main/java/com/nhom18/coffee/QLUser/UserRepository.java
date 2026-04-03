package com.nhom18.coffee.QLUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Hàm này cực kỳ quan trọng cho Đăng ký & Đăng nhập
    Optional<User> findByEmail(String email);
}