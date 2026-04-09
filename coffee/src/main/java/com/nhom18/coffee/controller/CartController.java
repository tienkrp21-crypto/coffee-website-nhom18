package com.nhom18.coffee.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.ApiResponse;
import com.nhom18.coffee.entity.CartItem;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.repository.CartItemRepository;
import com.nhom18.coffee.repository.ProductRepository;

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
    public ResponseEntity<ApiResponse<List<CartItem>>> getCartByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(cartItemRepository.findByUserId(userId)));
    }

    // 2. THÊM VÀO GIỎ HÀNG (Nếu có rồi thì tự cộng dồn)
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<String>> addToCart(@RequestParam Integer userId,
                                                         @RequestParam Integer productId,
                                                         @RequestParam Integer quantity) {

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProduct_Id(userId, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok(ApiResponse.success("Đã cộng dồn số lượng trong giỏ!", null));
        } else {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi: Không tìm thấy sản phẩm!"));
            }

            CartItem newItem = new CartItem();
            newItem.setUserId(userId);
            newItem.setProduct(productOpt.get());
            newItem.setQuantity(quantity);

            cartItemRepository.save(newItem);
            return ResponseEntity.ok(ApiResponse.success("Đã thêm món mới vào giỏ hàng!", null));
        }
    }

    // 3. SỬA SỐ LƯỢNG MÓN HÀNG TRONG GIỎ
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse<String>> updateCartItem(@PathVariable Integer cartItemId, @RequestParam Integer quantity) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);
        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            if (quantity <= 0) {
                cartItemRepository.deleteById(cartItemId);
                return ResponseEntity.ok(ApiResponse.success("Đã xóa món hàng vì số lượng bằng 0!", null));
            }

            item.setQuantity(quantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật số lượng thành công!", null));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi: Không tìm thấy món hàng trong giỏ!"));
    }

    // 4. XÓA MÓN KHỎI GIỎ HÀNG
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<String>> removeFromCart(@PathVariable Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa món khỏi giỏ hàng!", null));
    }

    // 5. TÍNH TỔNG TIỀN GIỎ HÀNG
    @GetMapping("/total/{userId}")
    public ResponseEntity<ApiResponse<Integer>> getTotalPrice(@PathVariable Integer userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        int total = 0;

        for (CartItem item : cartItems) {
            if (item.getProduct() != null && item.getProduct().getPrice() != null && item.getQuantity() != null) {
                total += item.getProduct().getPrice() * item.getQuantity();
            }
        }

        return ResponseEntity.ok(ApiResponse.success("Success", total));
    }
}

