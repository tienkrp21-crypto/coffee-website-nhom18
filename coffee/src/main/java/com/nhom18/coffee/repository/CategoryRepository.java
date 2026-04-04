package com.nhom18.coffee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}