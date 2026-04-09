package com.nhom18.coffee.QLcart;

import com.nhom18.coffee.QLcart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // Lấy toàn bộ sản phẩm trong giỏ của 1 khách hàng cụ thể
    List<CartItem> findByUserId(Integer userId);

    // Kiểm tra xem khách này đã thêm sản phẩm này vào giỏ trước đó chưa
    Optional<CartItem> findByUserIdAndProduct_Id(Integer userId, Integer productId);

    // Xóa sạch giỏ hàng sau khi khách thanh toán xong
    void deleteByUserId(Integer userId);
}