package com.seopro.api.aluno.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String turma;

    @Column(unique = true)
    private String matricula;

    // --- NOVO CAMPO ---
    @Enumerated(EnumType.STRING)
    private SituacaoMatricula situacao = SituacaoMatricula.ATIVO; // Padrão é ATIVO

    public enum SituacaoMatricula {
        ATIVO,
        TRANSFERIDO,
        EVADIDO,
        FORMADO
    }
}