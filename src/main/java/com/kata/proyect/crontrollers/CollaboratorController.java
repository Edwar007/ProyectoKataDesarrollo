package com.kata.proyect.crontrollers;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.services.CollaboratorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collaborator")
public class CollaboratorController {

    @Autowired
    private CollaboratorService collaboratorService;

    @Autowired
    private CollaboratorService service;

    @PostMapping
    public ResponseEntity<Collaborator> create(@Valid @RequestBody Collaborator collaborator) {
        return ResponseEntity.ok(service.save(collaborator));
    }

    @GetMapping
    public ResponseEntity<List<Collaborator>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Collaborator> getById(@PathVariable Long id) {
        Collaborator collaborator = service.findById(id);
        return collaborator != null ? ResponseEntity.ok(collaborator) : ResponseEntity.notFound().build();
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<Collaborator> getByCorreo(@PathVariable @Email String correo) {
        Collaborator collaborator = service.findByCorreo(correo);
        return collaborator != null ? ResponseEntity.ok(collaborator) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Collaborator> update(@PathVariable Long id, @Valid @RequestBody Collaborator collaborator) {
        Collaborator updated = service.update(id, collaborator);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
