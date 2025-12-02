package com.seopro.api.grade.model;

import com.seopro.api.aluno.model.Materia;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class GradeHoraria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String turma; // Ex: "3º Ano A"

    @Enumerated(EnumType.STRING)
    private DiaSemana dia; // SEGUNDA, TERCA...

    @Enumerated(EnumType.STRING)
    private HorarioAula horario; // PRIMEIRA_AULA, SEGUNDA_AULA...

    @Enumerated(EnumType.STRING)
    private Materia materia; // MATEMATICA, PORTUGUES...

    public enum DiaSemana {
        SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA
    }

    public enum HorarioAula {
        H07_00("07:00 - 07:50"),
        H07_50("07:50 - 08:40"),
        H08_40("08:40 - 09:30"),
        H09_50("09:50 - 10:40"), // Pós intervalo
        H10_40("10:40 - 11:30");

        private final String descricao;
        HorarioAula(String descricao) { this.descricao = descricao; }
        public String getDescricao() { return descricao; }
    }
}