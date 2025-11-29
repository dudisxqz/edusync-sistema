package com.seopro.api.academico.model;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.model.Materia;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Materia materia;

    private Double valor;

    private Integer faltas;

    private Integer bimestre;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
}