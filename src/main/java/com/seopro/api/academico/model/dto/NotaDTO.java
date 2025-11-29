package com.seopro.api.academico.model.dto;

import com.seopro.api.aluno.model.Materia;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NotaDTO(
        @NotNull Long alunoId,
        @NotNull Materia materia,

        @Min(0) @Max(10) Double valor,

        Integer faltas,

        @Min(1) @Max(4) Integer bimestre
) {}