package com.nhom18.coffee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nhom18.coffee.QLcart.CartItem;
import com.nhom18.coffee.QLcart.CartItemRepository;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

// Náº¿u chá»¯ Product hoáº·c ProductRepository bá»‹ Ä‘á», nhá»› Alt + Enter Ä‘á»ƒ Import nhÃ©!

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // 1. LẤY DANH SÁCH GIỎ HÀNG
    @GetMapping("/{userId}")
    public List<CartItem> getCartByUserId(@PathVariable Integer userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // 2. THÊM VÀO GIỎ HÀNG (Nếu có rồi thì tự cộng dồn)
    @PostMapping("/add")
    public String addToCart(@RequestParam Integer userId,
                            @RequestParam Integer productId,
                            @RequestParam Integer quantity) {

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProduct_Id(userId, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
            return "Đã cộng dồn số lượng trong giỏ!";
        } else {
            Optional<Product> productOpt = productRepository.findById(productId);
            if(productOpt.isEmpty()) return "Lỗi: Không tìm thấy sản phẩm!";

            CartItem newItem = new CartItem();
            newItem.setUserId(userId);
            newItem.setProduct(productOpt.get());
            newItem.setQuantity(quantity);

            cartItemRepository.save(newItem);
            return "Đã thêm món mới vào giỏ hàng!";
        }
    }

    // 3. SỬA SỐ LƯỢNG (Ví dụ khách đổi từ 1 ly thành 5 ly)
    @PutMapping("/update/{cartItemId}")
    public String updateQuantity(@PathVariable Integer cartItemId, @RequestParam Integer quantity) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);

        if(itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            // Nếu khách giảm số lượng về 0 hoặc âm -> Xóa luôn món đó
            if (quantity <= 0) {
                cartItemRepository.deleteById(cartItemId);
                return "Đã xóa món hàng vì số lượng bằng 0!";
            }

            item.setQuantity(quantity);
            cartItemRepository.save(item);
            return "Cập nhật số lượng thành công!";
        }
        return "Lỗi: Không tìm thấy món hàng trong giỏ!";
    }

    // 4. XÓA MÓN KHỎI GIỎ HÀNG
    @DeleteMapping("/remove/{cartItemId}")
    public String removeFromCart(@PathVariable Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return "Đã xóa món khỏi giỏ hàng!";
    }

    // 5. TÍNH TỔNG TIỀN GIỎ HÀNG
    @GetMapping("/total/{userId}")
    public Integer getTotalPrice(@PathVariable Integer userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        int total = 0;

        for (CartItem item : cartItems) {
            // Lấy Giá sản phẩm * Số lượng
            total += item.getProduct().getPrice() * item.getQuantity();
        }

        return total;
    }
}