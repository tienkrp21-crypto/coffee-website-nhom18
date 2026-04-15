package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.VoucherDTO;

public interface VoucherService {
    
    List<VoucherDTO> getAllVouchers();
    
    VoucherDTO getVoucherById(Integer id);
    
    VoucherDTO createVoucher(VoucherDTO voucherDTO);
    
    VoucherDTO updateVoucher(Integer id, VoucherDTO voucherDTO);
    
    void toggleVoucherStatus(Integer id);
}
