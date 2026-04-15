package com.nhom18.coffee.QLUser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Cấp cho Spring Boot một cái máy băm mật khẩu chuẩn BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bộ luật dặn dò bảo vệ
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable()) // Tắt bảo vệ CSRF để Postman gửi dữ liệu được
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/error").permitAll() // MỞ CỬA TỰ DO cho mọi API có chữ /api/auth/
                .anyRequest().authenticated() // Các API còn lại (như /api/cart) vẫn khóa chặt
            );
        return http.build();
    }
}