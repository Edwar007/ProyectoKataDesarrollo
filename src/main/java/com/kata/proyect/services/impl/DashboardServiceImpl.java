package com.kata.proyect.services.impl;

import com.kata.proyect.entities.Collaborator;
import com.kata.proyect.entities.Dashboard;
import com.kata.proyect.entities.Onbording;
import com.kata.proyect.enums.EstadoOnbording;
import com.kata.proyect.repositories.CollaboratorRepository;
import com.kata.proyect.repositories.DashboardRepository;
import com.kata.proyect.repositories.OnbordingRepository;
import com.kata.proyect.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardServiceImpl implements DashboardService {
    @Autowired
    private DashboardRepository repository;
    @Autowired
    private CollaboratorRepository collaboratorRepository;
    @Autowired
    private OnbordingRepository onbordingRepository;
    @Autowired
    private EmailServiceImpl emailService;

    @Override
    public Dashboard save(Dashboard dashboard) {
        Collaborator col = collaboratorRepository.findById(dashboard.getCollaborador().getId())
                .orElseThrow(() -> new IllegalArgumentException("El colaborador no existe"));

        Onbording onb = onbordingRepository.findById(dashboard.getOnbording().getId())
                .orElseThrow(() -> new IllegalArgumentException("El onbording no existe"));

        Long colaboradorId = dashboard.getCollaborador().getId();
        Long onbordingId = dashboard.getOnbording().getId();
        boolean yaExiste = repository.existsByCollaboradorIdAndOnbordingId(colaboradorId, onbordingId);
        if (yaExiste) {
            throw new IllegalArgumentException("Este colaborador ya está asignado a este proceso de onboarding.");
        }
        Dashboard saved = repository.save(dashboard);

        // Enviar correo al colaborador
        String para = col.getCorreo();
        String asunto = "Has sido invitado a un onboarding";
        String contenido = String.format(
                "Hola %s,\n\n" +
                        "Has sido invitado al proceso de onboarding **%s**.\n\n" +
                        "Fecha de inicio: %s\n" +
                        "Horario diario: de %s a %s\n" +
                        "Número de sesiones: %d\n\n" +
                        "Por favor revisa los detalles completos en la plataforma.\n\n" +
                        "Saludos,\nEquipo de Recursos Humanos",
                col.getNombre(),
                onb.getNombre(),
                onb.getFecIni(),
                onb.getHoraInicio(),
                onb.getHoraFin(),
                onb.getNumSesiones()
        );

        emailService.enviarCorreo(para, asunto, contenido);
        return saved;
    }

    @Override
    public List<Dashboard> findAll() {
        return repository.findAll();
    }

    @Override
    public Dashboard findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Collaborator> findCollaboratorsByOnbordingId(Long onbordingId) {
        return repository.findCollaboratorsByOnbordingId(onbordingId);
    }
    @Override
    public Optional<Dashboard> findByOnbordingIdAndCollaboratorId(Long onboardingId, Long collaboratorId) {
        return repository.findByOnbordingIdAndCollaboradorId(onboardingId, collaboratorId);
    }

    @Override
    public Dashboard update(Long id, Dashboard dashboard) {

        Collaborator col = collaboratorRepository.findById(dashboard.getCollaborador().getId())
                .orElseThrow(() -> new IllegalArgumentException("El colaborador no existe"));

        Onbording onb = onbordingRepository.findById(dashboard.getOnbording().getId())
                .orElseThrow(() -> new IllegalArgumentException("El onbording no existe"));
        Dashboard existing = findById(id);
        if (existing != null) {
            existing.setEstado(dashboard.getEstado());
            existing.setCollaborador(dashboard.getCollaborador());
            existing.setOnbording(dashboard.getOnbording());
            return repository.save(existing);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public void cancelarInvitacionesDeOnboarding(Long onboardingId) {
        Optional<Onbording> onboardingOpt = onbordingRepository.findById(onboardingId);
        if (!onboardingOpt.isPresent()) return;

        Onbording onboarding = onboardingOpt.get();
        List<Collaborator> colaboradores = repository.findCollaboratorsByOnbordingId(onboardingId);

        for (Collaborator c : colaboradores) {
            String asunto = "Cancelación del Onboarding \"" + onboarding.getNombre() + "\"";

            String contenido = String.format(
                    "Hola %s,\n\n" +
                            "Te informamos que el onboarding titulado \"%s\" programado para el %s, desde las %s hasta las %s, ha sido cancelado.\n\n" +
                            "Por favor ignora la invitación anterior.\n\nSaludos cordiales.",
                    c.getNombre(),
                    onboarding.getNombre(),
                    onboarding.getFecIni().toString(),
                    onboarding.getHoraInicio().toString(),
                    onboarding.getHoraFin().toString()
            );
            emailService.enviarCorreo(c.getCorreo(), asunto, contenido);
        }
        List<Dashboard> dashboards = repository.findByOnbordingId(onboardingId);
        for (Dashboard d : dashboards) {
            d.setEstado(false);
        }
        repository.saveAll(dashboards);
    }

    @Service
    public class RecordatorioService {

        @Autowired
        private OnbordingRepository onboardingRepository;

        @Autowired
        private DashboardRepository dashboardRepository;

        @Autowired
        private EmailServiceImpl emailService;


        @Scheduled(cron = "0 0 8 * * ?") // Se ejecuta todos los días a las 8:00 AM
        //@Scheduled(cron = "0 * * * * *") // Cada minuto, en el segundo 0
        public void enviarRecordatorios() {
            LocalDate hoy = LocalDate.now();
            LocalDate objetivo = hoy.plusDays(7); //7 dias despues
            //LocalDate objetivo = LocalDate.now().plusDays(1);

            List<Onbording> onboardings = onboardingRepository.findByEstadoAndFecIni(EstadoOnbording.PENDIENTE, objetivo);

            for (Onbording ob : onboardings) {
                List<Collaborator> colaboradores = dashboardRepository.findCollaboratorsByOnbordingId(ob.getId());

                for (Collaborator c : colaboradores) {
                    String asunto = "Recordatorio: Onboarding \"" + ob.getNombre() + "\" en una semana";

                    String contenido = String.format(
                            "Hola %s,\n\n" +
                                    "Este es un recordatorio de que estás invitado(a) al onboarding \"%s\" programado para el %s, desde las %s hasta las %s.\n\n" +
                                    "¡Nos vemos pronto!\n\nSaludos.",
                            c.getNombre(),
                            ob.getNombre(),
                            ob.getFecIni().toString(),
                            ob.getHoraInicio().toString(),
                            ob.getHoraFin().toString()
                    );

                    emailService.enviarCorreo(c.getCorreo(), asunto, contenido);
                }
            }
        }
    }

}
