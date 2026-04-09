package com.nhom18.coffee.QLcart; // Đổi lại tên package nếu bạn đặt tên khác nhé
import com.nhom18.coffee.QLproducts.Product;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items") // Khớp chính xác với tên bảng trong DB
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id") // Khớp với cột user_id
    private Integer userId;

    // Khớp với cột product_id và tự động móc nối sang bảng products
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity; // Khớp với cột quantity

    // --- GETTER & SETTER ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}