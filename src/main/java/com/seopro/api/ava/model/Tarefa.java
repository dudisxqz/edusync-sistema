package com.seopro.api.ava.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDate dataEntrega;

    private String turma; // Ex: "3º Ano A" (Vincula a tarefa a uma turma inteira)

    private String materia; // Ex: "MATEMATICA"
}