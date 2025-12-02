package com.seopro.api.aluno.model.dto;

import com.seopro.api.aluno.model.Aluno.SituacaoMatricula;
import java.time.LocalDate;

public record AlunoDTO(
        // Aluno
        String nome,
        LocalDate dataNascimento,
        String cpf,
        String telefone,
        String endereco,

        // Responsável
        String nomeResponsavel,
        String cpfResponsavel,
        String telefoneResponsavel,
        String emailResponsavel,

        // Escolar
        String escola,
        String serie,
        String turma,
        LocalDate dataMatricula,

        String matricula,
        SituacaoMatricula situacao
) {}