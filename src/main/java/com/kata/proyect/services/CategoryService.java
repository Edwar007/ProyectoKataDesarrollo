package com.kata.proyect.services;

import com.kata.proyect.entities.Category;

import java.util.List;

public interface CategoryService {
    Category save(Category category);
    List<Category> findAll();
    Category findById(Long id);
    Category update(Long id, Category category);
    void delete(Long id);
}
