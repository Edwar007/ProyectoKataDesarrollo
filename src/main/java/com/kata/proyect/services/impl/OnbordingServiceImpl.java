package com.kata.proyect.services.impl;

import com.kata.proyect.entities.Onbording;
import com.kata.proyect.enums.EstadoOnbording;
import com.kata.proyect.repositories.OnbordingRepository;
import com.kata.proyect.services.DashboardService;
import com.kata.proyect.services.OnbordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
public class OnbordingServiceImpl implements OnbordingService {
    @Autowired
    private OnbordingRepository repository;
    @Autowired
    private DashboardService dashboardService;

    @Override
    public Onbording save(Onbording onbording) {
        DayOfWeek dayOfWeek = onbording.getFecIni().getDayOfWeek();

        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser sábado ni domingo");
        }
        onbording.setEstado(EstadoOnbording.PENDIENTE);
        return repository.save(onbording);
    }

    @Override
    public List<Onbording> findAll() {
        return repository.findAll();
    }
    @Override
    public Onbording findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Onbording update(Long id, Onbording onbording) {
        Onbording existing = findById(id);
        if (existing != null) {
            existing.setNombre(onbording.getNombre());
            existing.setFecIni(onbording.getFecIni());
            existing.setNumSesiones(onbording.getNumSesiones());
            existing.setHoraInicio(onbording.getHoraInicio());
            existing.setHoraFin(onbording.getHoraFin());
            existing.setCategoria(onbording.getCategoria());
            existing.setEstado(onbording.getEstado());

            Onbording updated = repository.save(existing);
            // Si se canceló, también cancelamos las invitaciones asociadas
            if ("CANCELADO".equalsIgnoreCase(String.valueOf(updated.getEstado()))) {
                dashboardService.cancelarInvitacionesDeOnboarding(updated.getId());
            }
            return updated;
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
