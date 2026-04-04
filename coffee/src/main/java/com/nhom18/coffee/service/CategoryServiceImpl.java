package com.nhom18.coffee.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhom18.coffee.dto.CategoryDTO;
import com.nhom18.coffee.entity.Category;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.CategoryRepository;


@Service
public class CategoryServiceImpl implements CategoryService {

    private static final String CATEGORY_NOT_FOUND_MSG = "Không tìm thấy danh mục với id: ";

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Override
    @Transactional
    public CategoryDTO create(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setStatus(1); // Mặc định khi tạo mới là "Hiện"
        return mapToDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void toggleStatus(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + id));
        category.setStatus(category.getStatus() == 1 ? 0 : 1);
        categoryRepository.save(category);
    }

    // Hàm phụ để chuyển từ Entity sang DTO
    private CategoryDTO mapToDTO(Category entity) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());
        return dto;
    }
    
    @Override
    public CategoryDTO getById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + id));
        return mapToDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO update(Integer id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return mapToDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MSG + id));
        
        // Chuyển sang Soft Delete (ẩn danh mục) thay vì Hard Delete để tránh lỗi khóa ngoại
        category.setStatus(0);
        categoryRepository.save(category);
    }

}