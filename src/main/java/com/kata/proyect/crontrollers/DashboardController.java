package com.kata.proyect.crontrollers;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.entities.Dashboard;
import com.kata.proyect.entities.Onbording;
import com.kata.proyect.repositories.CollaboratorRepository;
import com.kata.proyect.repositories.OnbordingRepository;
import com.kata.proyect.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("dashboard")
public class DashboardController {
    @Autowired
    private DashboardService service;

    @PostMapping
    public ResponseEntity<Dashboard> create(@RequestBody Dashboard dashboard) {
        return ResponseEntity.ok(service.save(dashboard));
    }

    @GetMapping
    public ResponseEntity<List<Dashboard>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getById(@PathVariable Long id) {
        Dashboard dashboard = service.findById(id);
        return dashboard != null ? ResponseEntity.ok(dashboard) : ResponseEntity.notFound().build();
    }

    @GetMapping("/onbording/{id}/collaborators")
    public ResponseEntity<List<Collaborator>> getCollaboratorsByOnbordingId(@PathVariable Long id) {
        List<Collaborator> collaborators = service.findCollaboratorsByOnbordingId(id);

        if (collaborators.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(collaborators);
    }

    @GetMapping("/{onboardingId}/collaborator/{collaboratorId}")
    public ResponseEntity<Long> getDashboardIdByOnboardingAndCollaborator(
            @PathVariable Long onboardingId,
            @PathVariable Long collaboratorId) {
        Optional<Dashboard> dashboard = service
                .findByOnbordingIdAndCollaboratorId(onboardingId, collaboratorId);

        if (dashboard.isPresent()) {
            return ResponseEntity.ok(dashboard.get().getId());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Dashboard> update(@PathVariable Long id, @RequestBody Dashboard dashboard) {
        Dashboard updated = service.update(id, dashboard);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
