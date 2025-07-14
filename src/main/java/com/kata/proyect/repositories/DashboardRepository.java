package com.kata.proyect.repositories;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.entities.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
    boolean existsByCollaboradorIdAndOnbordingId(Long colaboradorId, Long onbordingId);

    @Query("SELECT d.collaborador FROM Dashboard d WHERE d.onbording.id = :onbordingId")
    List<Collaborator> findCollaboratorsByOnbordingId(@Param("onbordingId") Long onbordingId);

    Optional<Dashboard> findByOnbordingIdAndCollaboradorId(Long onbordingId, Long colaboradorId);

    List<Dashboard> findByOnbordingId(Long onbordingId);



}
