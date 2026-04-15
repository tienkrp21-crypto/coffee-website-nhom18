package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.ShippingFeeDTO;
import com.nhom18.coffee.service.ShippingFeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/shipping-fees")
@CrossOrigin("*")
public class ShippingFeeController {

    private final ShippingFeeService shippingFeeService;

    public ShippingFeeController(ShippingFeeService shippingFeeService) {
        this.shippingFeeService = shippingFeeService;
    }

    @GetMapping
    public ResponseEntity<List<ShippingFeeDTO>> getAllShippingFees() {
        return ResponseEntity.ok(shippingFeeService.getAllShippingFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShippingFeeDTO> getShippingFeeById(@PathVariable Integer id) {
        return ResponseEntity.ok(shippingFeeService.getShippingFeeById(id));
    }

    @PostMapping
    public ResponseEntity<ShippingFeeDTO> createShippingFee(@Valid @RequestBody ShippingFeeDTO dto) {
        return new ResponseEntity<>(shippingFeeService.createShippingFee(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingFeeDTO> updateShippingFee(
            @PathVariable Integer id, 
            @Valid @RequestBody ShippingFeeDTO dto) {
        return ResponseEntity.ok(shippingFeeService.updateShippingFee(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShippingFee(@PathVariable Integer id) {
        shippingFeeService.deleteShippingFee(id);
        return ResponseEntity.noContent().build();
    }
}
