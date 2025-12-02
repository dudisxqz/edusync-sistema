package com.seopro.api.diario.model.dto;

import java.time.LocalDate;

public record DiarioDTO(
        LocalDate data,
        String turma,
        String conteudoMinistrado
) {}