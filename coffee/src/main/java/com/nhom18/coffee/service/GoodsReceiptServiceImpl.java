package com.nhom18.coffee.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.dto.GoodsReceiptDetailRequestDTO;
import com.nhom18.coffee.dto.GoodsReceiptRequestDTO;
import com.nhom18.coffee.dto.GoodsReceiptResponseDTO;
import com.nhom18.coffee.entity.GoodsReceipt;
import com.nhom18.coffee.entity.GoodsReceiptDetail;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.entity.User;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.GoodsReceiptRepository;
import com.nhom18.coffee.repository.ProductRepository;
import com.nhom18.coffee.repository.UserRepository;

@Service
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public GoodsReceiptServiceImpl(GoodsReceiptRepository goodsReceiptRepository,
                                   UserRepository userRepository,
                                   ProductRepository productRepository) {
        this.goodsReceiptRepository = goodsReceiptRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional // Rất quan trọng: Rollback toàn bộ nếu có lỗi xảy ra ở bất kỳ đâu trong hàm này
    public GoodsReceiptResponseDTO createGoodsReceipt(GoodsReceiptRequestDTO requestDTO) {
        
        // 1. Kiểm tra Admin (User)
        User admin = userRepository.findById(requestDTO.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Admin với ID: " + requestDTO.getAdminId()));

        // 2. Khởi tạo phiếu nhập
        GoodsReceipt receipt = new GoodsReceipt();
        receipt.setAdmin(admin);
        receipt.setNote(requestDTO.getNote());
        
        int totalCost = 0;

        // 3. Xử lý từng chi tiết nhập kho
        for (GoodsReceiptDetailRequestDTO detailDTO : requestDTO.getDetails()) {
            
            // 3.1 Kiểm tra sản phẩm có tồn tại không
            Product product = productRepository.findById(detailDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Sản phẩm với ID: " + detailDTO.getProductId()));
            
            // 3.2 Tạo Detail entity
            GoodsReceiptDetail detail = new GoodsReceiptDetail();
            detail.setProduct(product);
            detail.setQuantityAdded(detailDTO.getQuantityAdded());
            detail.setImportPrice(detailDTO.getImportPrice());
            
            // 3.3 Thêm Detail vào Phiếu nhập (Dùng helper method đã tạo)
            receipt.addDetail(detail);
            
            // 3.4 Cộng dồn tiền
            totalCost += (detailDTO.getQuantityAdded() * detailDTO.getImportPrice());
            
            // 3.5 CỘNG DỒN SỐ LƯỢNG TỒN KHO VÀO SẢN PHẨM
            product.setStockQuantity(product.getStockQuantity() + detailDTO.getQuantityAdded());
            // (Không cần productRepository.save(product) vì JPA có tính năng Dirty Checking -> Tự động update khi Transaction kết thúc)
        }

        receipt.setTotalCost(totalCost);

        // 4. Lưu phiếu nhập xuống DB (Cascade = ALL sẽ tự động lưu các Details)
        GoodsReceipt savedReceipt = goodsReceiptRepository.save(receipt);

        // 5. Build DTO trả về cho Frontend
        GoodsReceiptResponseDTO responseDTO = new GoodsReceiptResponseDTO();
        responseDTO.setId(savedReceipt.getId());
        responseDTO.setAdminId(savedReceipt.getAdmin().getId());
        responseDTO.setTotalCost(savedReceipt.getTotalCost());
        responseDTO.setNote(savedReceipt.getNote());
        responseDTO.setCreatedAt(savedReceipt.getCreatedAt());

        return responseDTO;
    }

    @Override
    public List<GoodsReceiptResponseDTO> getAllReceipts() {
        List<GoodsReceipt> receipts = goodsReceiptRepository.findAll();
        
        return receipts.stream().map(receipt -> {
            GoodsReceiptResponseDTO dto = new GoodsReceiptResponseDTO();
            dto.setId(receipt.getId());
            dto.setAdminId(receipt.getAdmin().getId());
            dto.setTotalCost(receipt.getTotalCost());
            dto.setNote(receipt.getNote());
            dto.setCreatedAt(receipt.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }
}
