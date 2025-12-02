package com.seopro.api.diario.controller;

import com.seopro.api.diario.model.DiarioClasse;
import com.seopro.api.diario.model.dto.DiarioDTO;
import com.seopro.api.diario.repository.DiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/diarios")
public class DiarioController {

    @Autowired
    private DiarioRepository repository;

    @PostMapping
    public DiarioClasse registrarConteudo(@RequestBody DiarioDTO dados) {
        DiarioClasse diario = new DiarioClasse();
        diario.setData(dados.data());
        diario.setTurma(dados.turma());
        diario.setConteudoMinistrado(dados.conteudoMinistrado());

        return repository.save(diario);
    }
}