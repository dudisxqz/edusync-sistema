package com.seopro.api.ava.controller;

import com.seopro.api.ava.model.Tarefa;
import com.seopro.api.ava.model.dto.TarefaDTO;
import com.seopro.api.ava.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaRepository repository;

    @GetMapping
    public List<Tarefa> listarTodas() {
        return repository.findAll();
    }

    @GetMapping("/turma/{turma}")
    public List<Tarefa> listarPorTurma(@PathVariable String turma) {
        return repository.findByTurma(turma);
    }

    @PostMapping
    public Tarefa criar(@RequestBody TarefaDTO dados) {
        Tarefa t = new Tarefa();
        t.setTitulo(dados.titulo());
        t.setDescricao(dados.descricao());
        t.setDataEntrega(dados.dataEntrega());
        t.setTurma(dados.turma());
        t.setMateria(dados.materia());

        return repository.save(t);
    }
}