package com.kata.proyect.crontrollers;

import com.kata.proyect.entities.Onbording;
import com.kata.proyect.services.OnbordingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/onbording")
public class OnbordingController {
    @Autowired
    private OnbordingService service;

    @PostMapping
    public ResponseEntity<Onbording> create(@Valid  @RequestBody Onbording onbording) {
        return ResponseEntity.ok(service.save(onbording));
    }

    @GetMapping
    public ResponseEntity<List<Onbording>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Onbording> getById(@PathVariable Long id) {
        Onbording entity = service.findById(id);
        return entity != null ? ResponseEntity.ok(entity) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Onbording> update(@PathVariable Long id, @Valid
    @RequestBody Onbording onbording) {
        Onbording updated = service.update(id, onbording);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
