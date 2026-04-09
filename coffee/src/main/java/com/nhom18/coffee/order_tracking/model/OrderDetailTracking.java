package com.nhom18.coffee.order_tracking.model;

import com.nhom18.coffee.QLproducts.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_details")
public class OrderDetailTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id")
    private Integer orderId; // Không dùng ManyToOne để truy vấn cho nhẹ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product; // Vẫn mượn Product cũ để lấy tên món

    private Integer quantity;

    @Column(name = "price_at_purchase")
    private Integer priceAtPurchase;

    // --- GETTER & SETTER ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(Integer priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }
}