package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.VoucherDTO;
import com.nhom18.coffee.service.VoucherService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/vouchers")
@CrossOrigin("*")
public class VoucherController {

    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping
    public ResponseEntity<List<VoucherDTO>> getAllVouchers() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherDTO> getVoucherById(@PathVariable Integer id) {
        return ResponseEntity.ok(voucherService.getVoucherById(id));
    }

    @PostMapping
    public ResponseEntity<VoucherDTO> createVoucher(@Valid @RequestBody VoucherDTO voucherDTO) {
        VoucherDTO created = voucherService.createVoucher(voucherDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoucherDTO> updateVoucher(@PathVariable Integer id, @Valid @RequestBody VoucherDTO voucherDTO) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, voucherDTO));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<String> toggleVoucherStatus(@PathVariable Integer id) {
        voucherService.toggleVoucherStatus(id);
        return ResponseEntity.ok("Trạng thái Voucher đã được cập nhật");
    }
}
