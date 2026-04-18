package com.nhom18.coffee.checkout.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.QLproducts.Product;
import com.nhom18.coffee.QLproducts.ProductRepository;
import com.nhom18.coffee.checkout.dto.CheckoutItemRequest;
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

    @Override
    @Transactional // Đảm bảo lỗi ở bất kỳ khâu nào thì DB sẽ roll-back lại hết
    public Order createOrder(CheckoutRequest request) {
        
        Integer finalAmountCalculate = 0;
        
        // 1. Khởi tạo Order trước (nhưng CHƯA LƯU VỘI)
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        
        // Khởi tạo trạng thái ban đầu của mọi đơn hàng
        order.setPaymentStatus(0); // 0 = UNPAID (Thay vì truyền chữ "UNPAID")
        order.setOrderStatus("PENDING");
        order.setShippingFee(0); // Giả sử freeship
        order.setDiscountAmount(0);

        // 2. Tính tiền dựa trên các mặt hàng
        List<OrderDetail> orderDetailsToSave = new ArrayList<>();
        for (CheckoutItemRequest itemObj : request.getItems()) {
            Product product = productRepository.findById(itemObj.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID: " + itemObj.getProductId()));

            // Kiểm tra số lượng tồn kho
            if (product.getStockQuantity() != null && product.getStockQuantity() < itemObj.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho!");
            }

            // Trừ số lượng tồn kho (Tạm giữ hàng)
            if (product.getStockQuantity() != null) {
                product.setStockQuantity(product.getStockQuantity() - itemObj.getQuantity());
                productRepository.save(product);
            }

            // Tính tiền (Giá x Số lượng)
            int itemTotal = product.getPrice() * itemObj.getQuantity();
            finalAmountCalculate += itemTotal;

            // Gom chung vào list detail (CHƯA LƯU VỘI)
            OrderDetail detail = new OrderDetail();
            detail.setProduct(product);
            detail.setQuantity(itemObj.getQuantity());
            detail.setPriceAtPurchase(product.getPrice());
            orderDetailsToSave.add(detail);
        }

        // 3. Bây giờ đã có tổng tiền, ta nhét vào Order để nó KHÔNG CÒN BỊ NULL
        order.setTotalAmount(finalAmountCalculate);
        order.setFinalAmount(finalAmountCalculate);

        // 4. Lưu Order xuống Database trước để lấy ra ID
        Order savedOrder = orderRepository.save(order);

        // 5. Gắn ID Order vừa lưu vào từng chi tiết sản phẩm, rồi lưu nốt đám detail đó xuống DB
        for (OrderDetail detail : orderDetailsToSave) {
            detail.setOrder(savedOrder);
        }
        orderDetailRepository.saveAll(orderDetailsToSave);

        return savedOrder;
    }

    @Override
    @Transactional
    public void updateOrderStatus(Integer orderId, Integer paymentStatus, String orderStatus) { // Đổi String thành Integer
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy Order ID: " + orderId));
        order.setPaymentStatus(paymentStatus);
        order.setOrderStatus(orderStatus);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void restoreStock(Integer orderId) {
        // Lấy lại danh sách hàng trong đơn để hoàn vào kho
        // (Sẽ triển khai sau nếu bạn cần API hủy đơn hàng)
    }
}