package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.ShippingFeeDTO;

public interface ShippingFeeService {
    
    List<ShippingFeeDTO> getAllShippingFees();
    
    ShippingFeeDTO getShippingFeeById(Integer id);
    
    ShippingFeeDTO createShippingFee(ShippingFeeDTO dto);
    
    ShippingFeeDTO updateShippingFee(Integer id, ShippingFeeDTO dto);
    
    void deleteShippingFee(Integer id);
}
