package com.nhom18.coffee.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.dto.OrderDTO;
import com.nhom18.coffee.dto.OrderDetailDTO;
import com.nhom18.coffee.entity.Order;
import com.nhom18.coffee.entity.OrderDetail;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.OrderDetailRepository;
import com.nhom18.coffee.repository.OrderRepository;
import com.nhom18.coffee.repository.ProductRepository;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, 
                            OrderDetailRepository orderDetailRepository, 
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Page<OrderDTO> getAllOrders(int page, int size, String orderStatus) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage;

        if (orderStatus != null && !orderStatus.isEmpty()) {
            orderPage = orderRepository.findByOrderStatus(orderStatus, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        return orderPage.map(this::mapToDTO);
    }

    @Override
    public OrderDTO getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        return mapToDTO(order);
    }

    @Override
    public OrderDTO updateOrderStatus(Integer id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        String oldStatus = order.getOrderStatus();
        
        // Cập nhật trạng thái mới
        order.setOrderStatus(newStatus);

        // LOGIC QUAN TRỌNG: HỦY ĐƠN VÀ HOÀN LẠI KHO (CÁCH 1)
        if (newStatus.equalsIgnoreCase("CANCELLED") && !oldStatus.equalsIgnoreCase("CANCELLED")) {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(id);
            for (OrderDetail detail : details) {
                Product product = detail.getProduct();
                if (product != null) {
                    // Cộng lại số lượng kho
                    product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        // Logic phụ: Nếu đổi từ CANCELLED sang lại PENDING/PROCESSING (Phục hồi đơn)
        if (oldStatus.equalsIgnoreCase("CANCELLED") && !newStatus.equalsIgnoreCase("CANCELLED")) {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(id);
            for (OrderDetail detail : details) {
                Product product = detail.getProduct();
                if (product != null) {
                    // Trừ đi số lượng kho
                    product.setStockQuantity(product.getStockQuantity() - detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToDTO(updatedOrder);
    }

    // --- Helper Methods ---
    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setCustomerName(order.getUser() != null ? order.getUser().getFullName() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setFinalAmount(order.getFinalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        dto.setCreatedAt(order.getCreatedAt());

        // Map chi tiết đơn hàng nếu có
        if (order.getOrderDetails() != null) {
            List<OrderDetailDTO> detailsDTO = order.getOrderDetails().stream().map(detail -> {
                OrderDetailDTO dDto = new OrderDetailDTO();
                dDto.setId(detail.getId());
                if (detail.getProduct() != null) {
                    dDto.setProductId(detail.getProduct().getId());
                    dDto.setProductName(detail.getProduct().getName());
                    dDto.setProductImageUrl(detail.getProduct().getImageUrl());
                }
                dDto.setQuantity(detail.getQuantity());
                dDto.setPriceAtPurchase(detail.getPriceAtPurchase());
                dDto.setSubTotal(detail.getQuantity() * detail.getPriceAtPurchase());
                return dDto;
            }).collect(Collectors.toList());
            dto.setOrderDetails(detailsDTO);
        }

        return dto;
    }
}