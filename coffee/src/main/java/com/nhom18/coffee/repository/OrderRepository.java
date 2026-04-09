package com.nhom18.coffee.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findByOrderStatus(String orderStatus, Pageable pageable);
}
