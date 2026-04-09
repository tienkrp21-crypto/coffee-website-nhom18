package com.nhom18.coffee;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nhom18.coffee.dto.CategoryDTO;
import com.nhom18.coffee.entity.Category;
import com.nhom18.coffee.exception.ResourceNotFoundException;
import com.nhom18.coffee.repository.CategoryRepository;
import com.nhom18.coffee.service.CategoryServiceImpl;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category mockCategory;
    private CategoryDTO mockDto;

    @BeforeEach
    void setUp() {
        // Dữ liệu mẫu dưới DB
        mockCategory = new Category();
        mockCategory.setId(1);
        mockCategory.setName("Cà phê Đen");
        mockCategory.setDescription("Cà phê rang mộc");
        mockCategory.setStatus(1);

        // Dữ liệu mẫu do người dùng gửi lên (Postman)
        mockDto = new CategoryDTO();
        mockDto.setName("Cà phê Sữa Đá");
        mockDto.setDescription("Ngon tuyệt");
    }

    // ==========================================
    // 1. GET ALL
    // ==========================================
    @Test
    void testGetAll_Success() {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(mockCategory));

        List<CategoryDTO> result = categoryService.getAll();

        assertEquals(1, result.size());
        assertEquals("Cà phê Đen", result.get(0).getName());
        verify(categoryRepository, times(1)).findAll();
    }

    // ==========================================
    // 2. GET BY ID
    // ==========================================
    @Test
    void testGetById_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        CategoryDTO result = categoryService.getById(1);
        assertNotNull(result);
        assertEquals(1, result.getId());
    }

    @Test
    void testGetById_NotFound() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.getById(99));
    }

    // ==========================================
    // 3. CREATE
    // ==========================================
    @Test
    void testCreate_Success() {
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        CategoryDTO result = categoryService.create(mockDto);

        assertNotNull(result);
        assertEquals(1, result.getStatus()); // Đảm bảo status tự động là 1
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    // ==========================================
    // 4. UPDATE
    // ==========================================
    @Test
    void testUpdate_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        CategoryDTO result = categoryService.update(1, mockDto);

        assertNotNull(result);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testUpdate_NotFound() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.update(99, mockDto));
    }

    // ==========================================
    // 5. DELETE (SOFT DELETE)
    // ==========================================
    @Test
    void testDelete_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        categoryService.delete(1);

        // Kiểm tra xem category đã bị update status thành 0 chưa
        assertEquals(0, mockCategory.getStatus());
        verify(categoryRepository, times(1)).save(mockCategory);
    }

    @Test
    void testDelete_NotFound() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.delete(99));
    }

    // ==========================================
    // 6. TOGGLE STATUS
    // ==========================================
    @Test
    void testToggleStatus_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        categoryService.toggleStatus(1);

        // Ban đầu là 1, Test xem có đổi thành 0 không
        assertEquals(0, mockCategory.getStatus());
        verify(categoryRepository, times(1)).save(mockCategory);
    }

    @Test
    void testToggleStatus_NotFound() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.toggleStatus(99));
    }
}