package com.nhom18.coffee.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nhom18.coffee.dto.VoucherDTO;
import com.nhom18.coffee.entity.Voucher;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.VoucherRepository;

@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherServiceImpl(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    // --- Helper mapper ---
    private VoucherDTO toDTO(Voucher voucher) {
        VoucherDTO dto = new VoucherDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setDiscountAmount(voucher.getDiscountAmount());
        dto.setMinOrderValue(voucher.getMinOrderValue());
        dto.setExpirationDate(voucher.getExpirationDate());
        dto.setStatus(voucher.getStatus());
        return dto;
    }

    @Override
    public List<VoucherDTO> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherDTO getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Voucher với ID: " + id));
        return toDTO(voucher);
    }

    @Override
    public VoucherDTO createVoucher(VoucherDTO dto) {
        // Kiểm tra trùng lặp mã bằng JPA (hoặc bắt Exception Duplicate từ Entity Unique Constraint)
        voucherRepository.findByCode(dto.getCode()).ifPresent(v -> {
            throw new IllegalArgumentException("Mã Voucher đã tồn tại: " + dto.getCode());
        });

        Voucher voucher = new Voucher();
        voucher.setCode(dto.getCode().toUpperCase()); // Luôn format mã thành IN HOA cho chuẩn mực
        voucher.setDiscountAmount(dto.getDiscountAmount());
        voucher.setMinOrderValue(dto.getMinOrderValue());
        voucher.setExpirationDate(dto.getExpirationDate());
        
        // Mặc định tạo mới thì status = 1 (Hoạt động)
        voucher.setStatus(1);

        Voucher savedVoucher = voucherRepository.save(voucher);
        return toDTO(savedVoucher);
    }

    @Override
    public VoucherDTO updateVoucher(Integer id, VoucherDTO dto) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Voucher với ID: " + id));

        // Nếu muốn đổi mã mới, phải check xem mã mới đó đã có người xài chưa (nhưng loại trừ chính id hiện tại)
        if (!voucher.getCode().equalsIgnoreCase(dto.getCode())) {
            voucherRepository.findByCode(dto.getCode()).ifPresent(v -> {
                throw new IllegalArgumentException("Mã Voucher đã tồn tại: " + dto.getCode());
            });
        }

        voucher.setCode(dto.getCode().toUpperCase());
        voucher.setDiscountAmount(dto.getDiscountAmount());
        voucher.setMinOrderValue(dto.getMinOrderValue());
        voucher.setExpirationDate(dto.getExpirationDate());
        
        // Nếu Frontend truyền Status thì lấy, không thì giữ nguyên
        if (dto.getStatus() != null) {
            voucher.setStatus(dto.getStatus());
        }

        Voucher updatedVoucher = voucherRepository.save(voucher);
        return toDTO(updatedVoucher);
    }

    @Override
    public void toggleVoucherStatus(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Voucher với ID: " + id));
        
        // Toggle: Nếu đang 1 thành 0, đang 0 thành 1
        voucher.setStatus(voucher.getStatus() == 1 ? 0 : 1);
        voucherRepository.save(voucher);
    }
}
