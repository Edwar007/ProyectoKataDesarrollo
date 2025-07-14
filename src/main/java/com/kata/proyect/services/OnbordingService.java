package com.kata.proyect.services;

import com.kata.proyect.entities.Onbording;

import java.util.List;

public interface OnbordingService {
    Onbording save(Onbording onbording);
    List<Onbording> findAll();
    Onbording findById(Long id);
    Onbording update(Long id, Onbording onbording);
    void delete(Long id);
}
