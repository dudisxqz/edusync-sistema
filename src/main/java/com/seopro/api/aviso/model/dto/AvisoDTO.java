package com.seopro.api.aviso.model.dto;

public record AvisoDTO(
        String titulo,
        String mensagem,
        String turmaAlvo // Pode ser null se for para todos
) {}