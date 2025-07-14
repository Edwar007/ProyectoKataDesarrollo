package com.kata.proyect.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kata.proyect.enums.EstadoOnbording;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "onbording")
public class Onbording {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Column(name = "fec_ini")
    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fecIni;

    @Enumerated(EnumType.STRING)
    private EstadoOnbording estado;

    @Min(value = 1, message = "Debe haber al menos una sesión")
    @Max(value = 7, message = "Máximo 7 sesiones")
    @Column(name = "num_sesiones")
    private int numSesiones;

    @Column(name = "hora_ini")
    @NotNull(message = "Hora de inicio requerida")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    @NotNull(message = "Hora de finalización requerida")
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Category categoria;
}
