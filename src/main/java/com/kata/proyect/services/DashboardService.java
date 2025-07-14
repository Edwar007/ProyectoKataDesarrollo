package com.kata.proyect.services;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.entities.Dashboard;

import java.util.List;
import java.util.Optional;

public interface DashboardService {
    Dashboard save(Dashboard dashboard);
    List<Dashboard> findAll();
    Dashboard findById(Long id);
    List<Collaborator> findCollaboratorsByOnbordingId(Long onbordingId);
    Optional<Dashboard> findByOnbordingIdAndCollaboratorId(Long onboardingId, Long collaboratorId);
    Dashboard update(Long id, Dashboard dashboard);
    void delete(Long id);

    void cancelarInvitacionesDeOnboarding(Long onboardingId);
}
