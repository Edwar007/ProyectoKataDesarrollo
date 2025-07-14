package com.kata.proyect.services.impl;

/*
import com.kata.proyect.entities.Organizer;
import com.kata.proyect.repositories.OrganizerRepository;
import com.kata.proyect.services.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizerServiceImpl implements OrganizerService {
    @Autowired
    private OrganizerRepository repository;

    @Override
    public Organizer save(Organizer organizer) {

        return repository.save(organizer);
    }

    @Override
    public List<Organizer> findAll() {
        return repository.findAll();
    }

    @Override
    public Organizer findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Organizer update(Long id, Organizer organizer) {
        Organizer existing = findById(id);
        if (existing != null) {
            existing.setNombre(organizer.getNombre());
            existing.setCorreo(organizer.getCorreo());
            return repository.save(existing);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
 */