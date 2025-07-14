package com.kata.proyect.services.impl;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.repositories.CollaboratorRepository;
import com.kata.proyect.services.CollaboratorService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CollaboratorServiceImpl implements CollaboratorService {
    @Autowired
    private CollaboratorRepository repository;

    @Override
    public Collaborator save(Collaborator collaborator) {
        if (repository.existsByCorreo(collaborator.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado como colaborador.");
        }
        return repository.save(collaborator);
    }

    @Override
    public List<Collaborator> findAll() {
        return repository.findAll();
    }

    @Override
    public Collaborator findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Collaborator findByCorreo(String correo) {
        return repository.findByCorreo(correo)
                .orElseThrow(() -> new EntityNotFoundException("Colaborador no encontrado con correo: " + correo));
    }

    @Override
    public Collaborator update(Long id, Collaborator collaborator) {
        Collaborator existing = findById(id);
        if (existing != null) {
            existing.setNombre(collaborator.getNombre());
            existing.setCorreo(collaborator.getCorreo());
            existing.setFecIng(collaborator.getFecIng());
            return repository.save(existing);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
