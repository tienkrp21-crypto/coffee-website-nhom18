package com.nhom18.coffee.service;

import java.util.List;

import com.nhom18.coffee.dto.CategoryDTO;

public interface CategoryService {
    List<CategoryDTO> getAll();
    CategoryDTO getById(Integer id);
    CategoryDTO create(CategoryDTO dto);
    CategoryDTO update(Integer id, CategoryDTO dto);
    void delete(Integer id);
    void toggleStatus(Integer id); // Chức năng ẩn/hiện
}