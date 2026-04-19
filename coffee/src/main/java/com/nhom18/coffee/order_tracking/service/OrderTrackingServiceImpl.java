package com.nhom18.coffee.order_tracking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.QLproducts.Product;
import com.nhom18.coffee.QLproducts.ProductRepository;
import com.nhom18.coffee.checkout.service.PayOSService;
import com.nhom18.coffee.order_tracking.dto.OrderDetailDto;
import com.nhom18.coffee.order_tracking.dto.OrderHistoryResponse;
import com.nhom18.coffee.order_tracking.model.OrderDetailTracking;
import com.nhom18.coffee.order_tracking.model.OrderTracking;
import com.nhom18.coffee.order_tracking.repository.OrderDetailTrackingRepository;
import com.nhom18.coffee.order_tracking.repository.OrderTrackingRepository;

@Service
public class OrderTrackingServiceImpl implements OrderTrackingService {

    @Autowired
    private OrderTrackingRepository orderRepository;

    @Autowired
    private OrderDetailTrackingRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository; // Gọi Repo của module Product để thực hiện hoàn kho

    @Autowired
    private PayOSService payOSService;

    @Override
    public List<OrderHistoryResponse> getOrderHistory(Integer userId) {
        // 1. Tìm toàn bộ đơn hàng của User này, xếp mới nhất lên đầu
        List<OrderTracking> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<OrderHistoryResponse> responseList = new ArrayList<>();

        // 2. Lặp qua từng đơn hàng để nhét thông tin Detail vào
        for (OrderTracking order : orders) {
            OrderHistoryResponse response = new OrderHistoryResponse();
            response.setOrderId(order.getId());
            response.setTotalAmount(order.getTotalAmount());
            response.setFinalAmount(order.getFinalAmount());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setPaymentStatus(order.getPaymentStatus());
            response.setOrderStatus(order.getOrderStatus());
            response.setCreatedAt(order.getCreatedAt());

            // Tìm toàn bộ chi tiết sản phẩm của đơn hàng này
            List<OrderDetailTracking> details = orderDetailRepository.findByOrderId(order.getId());
            List<OrderDetailDto> itemDtos = new ArrayList<>();

            for (OrderDetailTracking detail : details) {
                OrderDetailDto dto = new OrderDetailDto();
                if (detail.getProduct() != null) {
                    dto.setProductId(detail.getProduct().getId());
                    dto.setProductName(detail.getProduct().getName());
                    dto.setImageUrl(detail.getProduct().getImageUrl());
                }
                dto.setQuantity(detail.getQuantity());
                dto.setPrice(detail.getPriceAtPurchase());
                itemDtos.add(dto);
            }
            
            response.setItems(itemDtos); // Gắn danh sách Item vào cái Order List chính
            responseList.add(response);
        }
        return responseList;
    }

    @Override
    @Transactional // Rất quan trọng, nếu lưu DB bị lỗi giữa chừng sẽ hoàn tác để tránh lệch hàng
    public String cancelOrder(Integer orderId) {
        OrderTracking order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // CHỈ CHO PHÉP HỦY NẾU ĐƠN Ở TRẠNG THÁI PENDING (Chờ xác nhận)
        if (!"PENDING".equalsIgnoreCase(order.getOrderStatus())) {
            return "Thất bại: Đơn hàng đã được xử lý hoặc đã giao, không thể tự hủy.";
        }

        // THAY ĐỔI Ở ĐÂY: Chặn mã QR trên Cổng thanh toán trước
        if ("PAYOS".equalsIgnoreCase(order.getPaymentMethod()) || "VNPAY".equalsIgnoreCase(order.getPaymentMethod())) {
            if (order.getOrderCode() != null) {
                // Gọi api hủy link payos
                payOSService.cancelPaymentLink(order.getOrderCode(), "Người dùng hủy đơn hàng");
            }
        }

        // 1. Cập nhật trạng thái đơn hàng thành Hủy (CANCELLED)
        order.setOrderStatus("CANCELLED");
        if (order.getPaymentStatus() == 0) { // Nếu chưa trả tiền, cho thành "Thanh toán bị Hủy" luôn
            order.setPaymentStatus(2); // 2 = FAILED/CANCELLED
        }
        orderRepository.save(order);

        // 2. Bắt đầu luồng kiểm kê kho: Tìm danh sách sản phẩm trong đơn
        List<OrderDetailTracking> details = orderDetailRepository.findByOrderId(orderId);
        
        // 3. Lặp qua từng món để CỘNG lại số lượng hàng bị hủy vào Kho (Restock)
        for (OrderDetailTracking detail : details) {
            Product product = detail.getProduct();
            if (product != null && product.getStockQuantity() != null) {
                // Tồn_kho_mới = Tồn_kho_cũ + Số_lượng_vừa_hủy
                product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
                productRepository.save(product);
            }
        }

        return "Thành công: Đã hủy đơn và hoàn lại số lượng hàng vào kho!";
    }

    @Override
    public String cancelOrderByOrderCode(Long orderCode) {
        // Tìm đơn hàng trên Database nhờ vào orderCode
        OrderTracking order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã: " + orderCode));

        // Không cần viết lại code hoàn kho, ủy quyền toàn bộ cho hàm cancelOrder cũ của bạn!
        return cancelOrder(order.getId());
    }
}