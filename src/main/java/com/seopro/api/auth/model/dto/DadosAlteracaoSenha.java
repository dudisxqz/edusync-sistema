package com.seopro.api.auth.model.dto;

public record DadosAlteracaoSenha(
        String senhaAntiga,
        String novaSenha
) {}