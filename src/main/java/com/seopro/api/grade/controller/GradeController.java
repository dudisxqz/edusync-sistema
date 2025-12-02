package com.seopro.api.grade.controller;

import com.seopro.api.grade.model.GradeHoraria;
import com.seopro.api.grade.model.dto.GradeHorariaDTO;
import com.seopro.api.grade.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grade")
public class GradeController {

    @Autowired
    private GradeRepository repository;

    @GetMapping("/{turma}")
    public List<GradeHoraria> listarPorTurma(@PathVariable String turma) {
        return repository.findByTurma(turma);
    }

    @PostMapping
    @Transactional // Importante para garantir que delete e save funcionem juntos
    public GradeHoraria salvarAula(@RequestBody GradeHorariaDTO dados) {
        // 1. Verifica se já existe aula neste dia/horário/turma
        var aulaExistente = repository.findByTurmaAndDiaAndHorario(
                dados.turma(), dados.dia(), dados.horario()
        );

        // 2. Se existir, deleta a antiga para dar lugar à nova (ou atualiza)
        aulaExistente.ifPresent(gradeHoraria -> repository.delete(gradeHoraria));

        // 3. Cria a nova aula
        GradeHoraria novaAula = new GradeHoraria();
        novaAula.setTurma(dados.turma());
        novaAula.setDia(dados.dia());
        novaAula.setHorario(dados.horario());
        novaAula.setMateria(dados.materia());

        return repository.save(novaAula);
    }

    // Endpoint para "Limpar" um horário (deixar vago)
    @DeleteMapping("/limpar")
    @Transactional
    public void removerAula(@RequestBody GradeHorariaDTO dados) {
        var aulaExistente = repository.findByTurmaAndDiaAndHorario(
                dados.turma(), dados.dia(), dados.horario()
        );
        aulaExistente.ifPresent(aula -> repository.delete(aula));
    }
}