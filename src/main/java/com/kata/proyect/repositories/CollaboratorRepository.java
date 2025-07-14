package com.kata.proyect.repositories;

import com.kata.proyect.entities.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollaboratorRepository extends JpaRepository<Collaborator,Long> {
    Optional<Collaborator> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
