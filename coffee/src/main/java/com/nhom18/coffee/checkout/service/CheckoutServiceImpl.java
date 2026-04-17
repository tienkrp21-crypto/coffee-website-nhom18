package com.nhom18.coffee.checkout.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.QLproducts.Product;
import com.nhom18.coffee.QLproducts.ProductRepository;
import com.nhom18.coffee.QLcart.CartItem; // Tui đã thêm import này
import com.nhom18.coffee.QLcart.CartItemRepository; // Tui đã thêm import này
import com.nhom18.coffee.checkout.dto.CheckoutRequest;
import com.nhom18.coffee.checkout.model.Order;
import com.nhom18.coffee.checkout.model.OrderDetail;
import com.nhom18.coffee.checkout.repository.OrderDetailRepository;
import com.nhom18.coffee.checkout.repository.OrderRepository;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    // --- BỘ PHẬN MỚI BỔ SUNG: LIÊN KẾT GIỎ HÀNG ---
    @Autowired
    private CartItemRepository cartItemRepository; 

    @Override
    @Transactional // Đảm bảo lỗi ở bất kỳ khâu nào thì DB sẽ roll-back lại hết
    public Order createOrder(CheckoutRequest request) {
        
        Integer finalAmountCalculate = 0;

        // 1. LẤY GIỎ HÀNG TỪ DATABASE
        List<CartItem> cartItems = cartItemRepository.findByUserId(request.getUserId());
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Lỗi: Giỏ hàng của bạn đang trống!");
        }
        
        // 2. Khởi tạo Order trước (nhưng CHƯA LƯU VỘI)
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        
        order.setPaymentStatus(0); // 0 = UNPAID
        order.setOrderStatus("PENDING");
        order.setShippingFee(0); // Giả sử freeship
        order.setDiscountAmount(0);

        // 3. Tính tiền dựa trên các mặt hàng TRONG GIỎ
        List<OrderDetail> orderDetailsToSave = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            int buyQuantity = cartItem.getQuantity();

            // Kiểm tra số lượng tồn kho
            if (product.getStockQuantity() != null && product.getStockQuantity() < buyQuantity) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho!");
            }

            // Trừ số lượng tồn kho (Tạm giữ hàng)
            if (product.getStockQuantity() != null) {
                product.setStockQuantity(product.getStockQuantity() - buyQuantity);
                productRepository.save(product);
            }

            // Tính tiền (Giá x Số lượng)
            int itemTotal = product.getPrice() * buyQuantity;
            finalAmountCalculate += itemTotal;

            // Gom chung vào list detail (CHƯA LƯU VỘI)
            OrderDetail detail = new OrderDetail();
            detail.setProduct(product);
            detail.setQuantity(buyQuantity);
            detail.setPriceAtPurchase(product.getPrice());
            orderDetailsToSave.add(detail);
        }

        // 4. Nhét tổng tiền vào Order rồi lưu xuống DB
        order.setTotalAmount(finalAmountCalculate);
        order.setFinalAmount(finalAmountCalculate);
        Order savedOrder = orderRepository.save(order);

        // 5. Gắn ID Order vừa lưu vào từng chi tiết sản phẩm, rồi lưu đám detail
        for (OrderDetail detail : orderDetailsToSave) {
            detail.setOrder(savedOrder);
        }
        orderDetailRepository.saveAll(orderDetailsToSave);

        // 6. QUAN TRỌNG NHẤT: Xóa sạch giỏ hàng sau khi đã lên đơn thành công!
        cartItemRepository.deleteByUserId(request.getUserId());

        return savedOrder;
    }

    @Override
    @Transactional
    public void updateOrderStatus(Integer orderId, Integer paymentStatus, String orderStatus) { 
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy Order ID: " + orderId));
        order.setPaymentStatus(paymentStatus);
        order.setOrderStatus(orderStatus);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void restoreStock(Integer orderId) {
        // 1. Lấy toàn bộ chi tiết món hàng của đơn bị hủy
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrder_Id(orderId);

        // 2. Duyệt qua từng món và cộng trả lại số lượng vào kho
        for (OrderDetail detail : orderDetails) {
            Product product = detail.getProduct();
            
            // Đảm bảo sản phẩm có quản lý tồn kho thì mới cộng lại
            if (product != null && product.getStockQuantity() != null) {
                int quantityToRestore = detail.getQuantity();
                product.setStockQuantity(product.getStockQuantity() + quantityToRestore);
                
                // Lưu lại số lượng mới vào DB
                productRepository.save(product);
            }
        }
        System.out.println("Đã hoàn trả số lượng vào kho cho đơn hàng ID: " + orderId);
    }
}