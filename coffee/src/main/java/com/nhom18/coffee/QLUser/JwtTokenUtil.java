package com.nhom18.coffee.QLUser;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenUtil {
    // Dùng 1 chuỗi bí mật cố định (Phải dài ít nhất 32 ký tự để đảm bảo bảo mật)
    private final String SECRET_KEY = "DayLaChuyenBiMatCuaNhom18CoffeeNheKhongDuocTietLo";

    // Tạo key từ chuỗi cố định đó
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    // Mã token có hiệu lực trong 1 ngày (86400000 milliseconds)
    private final long expirationTime = 86400000;

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }
}