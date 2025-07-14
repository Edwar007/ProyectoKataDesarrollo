package com.kata.proyect.repositories;

import com.kata.proyect.entities.Onbording;
import com.kata.proyect.enums.EstadoOnbording;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OnbordingRepository extends JpaRepository<Onbording,Long> {
    List<Onbording> findByEstadoAndFecIni(EstadoOnbording estado, LocalDate fecIni);
}
