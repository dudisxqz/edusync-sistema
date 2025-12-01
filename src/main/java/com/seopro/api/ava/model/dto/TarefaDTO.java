package com.seopro.api.ava.model.dto;

import java.time.LocalDate;

public record TarefaDTO(
        String titulo,
        String descricao,
        LocalDate dataEntrega,
        String turma,
        String materia
) {}