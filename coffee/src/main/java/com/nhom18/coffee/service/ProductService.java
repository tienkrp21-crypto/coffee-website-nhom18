package com.nhom18.coffee.service;

import org.springframework.data.domain.Page;

import com.nhom18.coffee.dto.ProductDTO;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page, int size, String keyword, Integer categoryId);
    ProductDTO getProductById(Integer id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Integer id, ProductDTO productDTO);
    void deleteProduct(Integer id);
}
