package com.seopro.api.aluno.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Aluno {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String turma;

    @Column(unique = true)
    private String matricula;

    @Enumerated(EnumType.STRING)
    private SituacaoMatricula situacao = SituacaoMatricula.ATIVO;

    public enum SituacaoMatricula {
        ATIVO,
        TRANSFERIDO,
        EVADIDO,
        FORMADO
    }
}