package com.seopro.api.diario.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data @Entity
public class DiarioClasse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate data;
    private String turma;
    @Column(columnDefinition = "TEXT")
    private String conteudoMinistrado;
}