package com.seopro.api.grade.model.dto;

import com.seopro.api.aluno.model.Materia;
import com.seopro.api.grade.model.GradeHoraria.DiaSemana;
import com.seopro.api.grade.model.GradeHoraria.HorarioAula;

public record GradeHorariaDTO(
        String turma,
        DiaSemana dia,
        HorarioAula horario,
        Materia materia
) {}