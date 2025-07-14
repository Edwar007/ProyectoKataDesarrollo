package com.kata.proyect.services;

import com.kata.proyect.entities.Collaborator;

import java.util.List;

public interface CollaboratorService {
    Collaborator save(Collaborator collaborator);
    List<Collaborator> findAll();
    Collaborator findById(Long id);
    Collaborator findByCorreo(String correo);
    Collaborator update(Long id, Collaborator collaborator);
    void delete(Long id);
}
