package com.nhom18.coffee.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nhom18.coffee.dto.ShippingFeeDTO;
import com.nhom18.coffee.entity.ShippingFee;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.ShippingFeeRepository;

@Service
public class ShippingFeeServiceImpl implements ShippingFeeService {

    private final ShippingFeeRepository shippingFeeRepository;

    public ShippingFeeServiceImpl(ShippingFeeRepository shippingFeeRepository) {
        this.shippingFeeRepository = shippingFeeRepository;
    }

    private ShippingFeeDTO toDTO(ShippingFee entity) {
        ShippingFeeDTO dto = new ShippingFeeDTO();
        dto.setId(entity.getId());
        dto.setRegionName(entity.getRegionName());
        dto.setFee(entity.getFee());
        return dto;
    }

    @Override
    public List<ShippingFeeDTO> getAllShippingFees() {
        return shippingFeeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ShippingFeeDTO getShippingFeeById(Integer id) {
        ShippingFee fee = shippingFeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình phí ship với ID: " + id));
        return toDTO(fee);
    }

    @Override
    public ShippingFeeDTO createShippingFee(ShippingFeeDTO dto) {
        // Đảm bảo không tạo 2 khu vực trùng tên
        shippingFeeRepository.findByRegionName(dto.getRegionName()).ifPresent(f -> {
            throw new IllegalArgumentException("Khu vực này đã tồn tại biểu phí: " + dto.getRegionName());
        });

        ShippingFee fee = new ShippingFee();
        fee.setRegionName(dto.getRegionName());
        fee.setFee(dto.getFee());

        ShippingFee savedFee = shippingFeeRepository.save(fee);
        return toDTO(savedFee);
    }

    @Override
    public ShippingFeeDTO updateShippingFee(Integer id, ShippingFeeDTO dto) {
        ShippingFee fee = shippingFeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình phí ship với ID: " + id));

        // Nếu đổi tên khu vực, check trùng tên với khu vực khác
        if (!fee.getRegionName().equalsIgnoreCase(dto.getRegionName())) {
            shippingFeeRepository.findByRegionName(dto.getRegionName()).ifPresent(f -> {
                throw new IllegalArgumentException("Khu vực này đã tồn tại biểu phí: " + dto.getRegionName());
            });
        }

        fee.setRegionName(dto.getRegionName());
        fee.setFee(dto.getFee());

        ShippingFee updatedFee = shippingFeeRepository.save(fee);
        return toDTO(updatedFee);
    }

    @Override
    public void deleteShippingFee(Integer id) {
        ShippingFee fee = shippingFeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình phí ship với ID: " + id));
        shippingFeeRepository.delete(fee);
    }
}
