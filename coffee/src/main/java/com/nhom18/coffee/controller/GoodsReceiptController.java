package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.GoodsReceiptRequestDTO;
import com.nhom18.coffee.dto.GoodsReceiptResponseDTO;
import com.nhom18.coffee.service.GoodsReceiptService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/goods-receipts")
@CrossOrigin("*")
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    public GoodsReceiptController(GoodsReceiptService goodsReceiptService) {
        this.goodsReceiptService = goodsReceiptService;
    }

    @PostMapping
    public ResponseEntity<GoodsReceiptResponseDTO> createReceipt(@Valid @RequestBody GoodsReceiptRequestDTO requestDTO) {
        GoodsReceiptResponseDTO response = goodsReceiptService.createGoodsReceipt(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GoodsReceiptResponseDTO>> getAllReceipts() {
        return ResponseEntity.ok(goodsReceiptService.getAllReceipts());
    }
}
