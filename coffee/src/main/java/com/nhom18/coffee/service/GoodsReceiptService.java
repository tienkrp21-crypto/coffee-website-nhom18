package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.GoodsReceiptRequestDTO;
import com.nhom18.coffee.dto.GoodsReceiptResponseDTO;

public interface GoodsReceiptService {
    GoodsReceiptResponseDTO createGoodsReceipt(GoodsReceiptRequestDTO requestDTO);
    
    List<GoodsReceiptResponseDTO> getAllReceipts();
}
