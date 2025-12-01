package com.seopro.api.aluno.controller;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.model.Aluno.SituacaoMatricula; // Importe o Enum
import com.seopro.api.aluno.model.dto.AlunoDTO;
import com.seopro.api.aluno.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService service;

    @GetMapping
    public List<Aluno> listar() {
        return service.listarTodos();
    }

    // Adicionei para buscar um aluno específico (usado na Declaração)
    @GetMapping("/{id}")
    public Aluno buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Aluno criar(@RequestBody AlunoDTO dados) {
        return service.criar(dados);
    }

    // --- NOVO ENDPOINT: MUDAR STATUS ---
    @PatchMapping("/{id}/status")
    public Aluno atualizarStatus(@PathVariable Long id, @RequestBody SituacaoMatricula situacao) {
        return service.atualizarStatus(id, situacao);
    }
}