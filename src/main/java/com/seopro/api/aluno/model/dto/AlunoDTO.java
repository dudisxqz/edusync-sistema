package com.seopro.api.aluno.model.dto;

import com.seopro.api.aluno.model.Aluno.SituacaoMatricula;

public record AlunoDTO(
        String nome,
        String turma,
        String matricula,
        SituacaoMatricula situacao // Novo campo opcional
) {}