package com.kata.proyect.crontrollers;
/*
import com.kata.proyect.entities.Organizer;
import com.kata.proyect.services.OrganizerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("organizer")
public class OrganizerController {
    @Autowired
    private OrganizerService service;

    @PostMapping
    public ResponseEntity<Organizer> create(@Valid  @RequestBody Organizer organizer) {
        return ResponseEntity.ok(service.save(organizer));
    }

    @GetMapping
    public ResponseEntity<List<Organizer>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organizer> getById(@PathVariable Long id) {
        Organizer organizer = service.findById(id);
        return organizer != null ? ResponseEntity.ok(organizer) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organizer> update(@PathVariable Long id, @Valid @RequestBody Organizer organizer) {
        Organizer updated = service.update(id, organizer);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
 */