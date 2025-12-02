package com.seopro.api.aviso.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Aviso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    @Column(columnDefinition = "TEXT")
    private String mensagem;
    private LocalDate dataPostagem = LocalDate.now();
    private String turmaAlvo;
}