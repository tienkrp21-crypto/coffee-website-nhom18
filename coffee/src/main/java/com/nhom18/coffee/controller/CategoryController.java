package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.CategoryDTO;
import com.nhom18.coffee.service.CategoryService;


@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable Integer id) {
        return categoryService.getById(id);
    }

    @PostMapping
    public CategoryDTO create(@RequestBody CategoryDTO dto) {
        return categoryService.create(dto);
    }

    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Integer id, @RequestBody CategoryDTO dto) {
        return categoryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public void toggle(@PathVariable Integer id) {
        categoryService.toggleStatus(id);
    }
}