package com.seopro.api.aluno.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- DADOS DO ALUNO ---
    private String nome;
    private LocalDate dataNascimento;
    private String cpf;
    private String telefone;
    private String endereco;

    // --- DADOS DO RESPONSÁVEL ---
    private String nomeResponsavel;
    private String cpfResponsavel;
    private String telefoneResponsavel;
    private String emailResponsavel;

    // --- DADOS ESCOLARES ---
    private String escola; // Ex: "EEEM MAJOR GUAPINDAIA"
    private String serie;  // Ex: "3º Ano"
    private String turma;  // Ex: "3º Ano A"
    private LocalDate dataMatricula;

    @Column(unique = true)
    private String matricula;

    @Enumerated(EnumType.STRING)
    private SituacaoMatricula situacao = SituacaoMatricula.ATIVO;

    public enum SituacaoMatricula { ATIVO, TRANSFERIDO, EVADIDO, FORMADO }
}