package com.nhom18.coffee.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.dto.ProductDTO;
import com.nhom18.coffee.entity.Category;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.CategoryRepository;
import com.nhom18.coffee.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private static final String PRODUCT_NOT_FOUND_MSG = "Không tìm thấy sản phẩm với ID: ";
    private static final String CATEGORY_NOT_FOUND_MSG = "Không tìm thấy danh mục với ID: ";

    // Injection thông qua Constructor (thay thế chức năng của Lombok @RequiredArgsConstructor)
    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Page<ProductDTO> getAllProducts(int page, int size, String keyword, Integer categoryId) {
        // Mặc định sắp xếp các sản phẩm mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage;

        // Chỉ hiện status = 1 (sản phẩm còn bán/chưa bị xóa)
        if (categoryId != null && categoryId > 0) {
            productPage = productRepository.findByCategoryIdAndStatus(categoryId, 1, pageable);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            productPage = productRepository.searchByKeywordAndStatus(keyword.trim(), 1, pageable);
        } else {
            productPage = productRepository.findByStatus(1, pageable);
        }

        // map() của Spring Page sẽ duyệt qua từng Product và biến nó thành ProductDTO
        return productPage.map(this::mapToDTO);
    }

    @Override
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PRODUCT_NOT_FOUND_MSG + id));
        return mapToDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        // 1. Kiểm tra Danh mục có thực sự tồn tại hay không
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + productDTO.getCategoryId()));

        // 2. Map dữ liệu bằng tay vì không dùng MapStruct hay Lombok Builder
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setUnit(productDTO.getUnit());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setImageUrl(productDTO.getImageUrl());
        product.setDescription(productDTO.getDescription());
        product.setCategory(category); // Gắn thẳng đối tượng Category vào

        // Gán các giá trị mặc định cho 1 sản phẩm mới
        product.setStatus(1);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // 3. Tự động sinh mã SKU theo cấu trúc: SP-<CategoryId>-<ChuỗiNgẫuNhiên5KýTự>
        String generatedSku;
        do {
            String randomPart = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
            generatedSku = "SP-" + category.getId() + "-" + randomPart;
        } while (productRepository.existsBySku(generatedSku)); // Kiểm tra xem DB có lỡ trùng cái nào chưa
        
        product.setSku(generatedSku);

        // Lưu xuống DB
        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Integer id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PRODUCT_NOT_FOUND_MSG + id));

        // Kiểm tra xem người dùng có gõ trùng tên với một cái sản phẩm CŨ (khác ID hiện tại) nào đó không
        if (productRepository.existsByNameAndIdNot(productDTO.getName(), id)) {
            // Ném lỗi Runtime tạm thời, lúc lên Controller sẽ trả về 400 Bad Request
            throw new RuntimeException("Tên sản phẩm này đã được sử dụng bởi một mặt hàng khác.");
        }

        // Nếu FE truyền lên categoryId mới, ta phải check lại xem Danh mục mới đó có tồn tại không
        if (!product.getCategory().getId().equals(productDTO.getCategoryId())) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + productDTO.getCategoryId()));
            product.setCategory(category);
        }

        // Cập nhật thông tin
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setUnit(productDTO.getUnit());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setImageUrl(productDTO.getImageUrl());
        product.setDescription(productDTO.getDescription());
        
        // Cập nhật thời gian update
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PRODUCT_NOT_FOUND_MSG + id));
                
        // Áp dụng Soft Delete: 0 = Xóa (Không hiển thị), 1 = Mở bán
        product.setStatus(0); 
        product.setUpdatedAt(LocalDateTime.now());
        
        productRepository.save(product);
    }

    // Hàm tiện ích: Đổi Từng Dòng Entity -> DTO bằng thủ công (Không Lombok)
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku()); // SKU được show ra sau khi đã tự động tạo
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setUnit(product.getUnit());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        // Trích xuất thông tin Danh mục liên kết
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        return dto;
    }
}
