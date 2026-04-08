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
    // Tạo Token giấu mã OTP vào trong (Sống 5 phút)
    public String generateOtpToken(String email, String otpCode) {
        long otpExpirationTime = 5 * 60 * 1000; // 5 phút
        return Jwts.builder()
                .setSubject(email)
                .claim("otp", otpCode) // Giấu 6 số OTP vào đây
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + otpExpirationTime))
                .signWith(key)
                .compact();
    }

    // Lấy thông tin từ Token ra để kiểm tra
    public io.jsonwebtoken.Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}