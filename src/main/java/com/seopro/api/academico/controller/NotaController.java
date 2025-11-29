package com.seopro.api.academico.controller;

import com.seopro.api.academico.model.Nota;
import com.seopro.api.academico.model.dto.NotaDTO;
import com.seopro.api.academico.repository.NotaRepository;
import com.seopro.api.aluno.repository.AlunoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping
    public List<Nota> listar() {
        return notaRepository.findAll();
    }

    @PostMapping
    public Nota lancarNota(@RequestBody @Valid NotaDTO dados) {

        var aluno = alunoRepository.findById(dados.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (notaRepository.existsByAlunoAndMateriaAndBimestre(aluno, dados.materia(), dados.bimestre())) {
            throw new RuntimeException("❌ Erro: Já existe uma nota lançada para " +
                    dados.materia() + " no " + dados.bimestre() + "º Bimestre.");
        }

        Nota nota = new Nota();
        nota.setValor(dados.valor());
        nota.setFaltas(dados.faltas() != null ? dados.faltas() : 0);
        nota.setMateria(dados.materia());
        nota.setBimestre(dados.bimestre());
        nota.setAluno(aluno);

        return notaRepository.save(nota);
    }
}