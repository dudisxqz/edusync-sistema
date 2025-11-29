package com.seopro.api.academico.controller;

import com.seopro.api.academico.model.Nota;
import com.seopro.api.academico.repository.NotaRepository;
import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.repository.AlunoRepository;
import com.seopro.api.infra.service.IAService;
import com.seopro.api.ocorrencia.model.Ocorrencia;
import com.seopro.api.ocorrencia.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private NotaRepository notaRepository;
    @Autowired private OcorrenciaRepository ocorrenciaRepository;
    @Autowired private IAService iaService;

    @GetMapping("/gerar/{alunoId}")
    public String gerarRelatorioCompleto(@PathVariable Long alunoId) {

        Aluno aluno = alunoRepository.findById(alunoId).orElseThrow();

        List<Nota> notas = notaRepository.findAll().stream()
                .filter(n -> n.getAluno().getId().equals(alunoId))
                .toList();

        System.out.println("🔍 Notas encontradas para o aluno " + aluno.getNome() + ": " + notas.size());

        String resumoNotas = notas.stream()
                .map(n -> n.getMateria() + ": " + n.getValor())
                .collect(Collectors.joining(", "));

        List<Ocorrencia> ocorrencias = ocorrenciaRepository.findAll().stream()
                .filter(o -> o.getAluno().getId().equals(alunoId))
                .toList();
        String resumoOcorrencias = ocorrencias.stream()
                .map(o -> o.getTipo() + " (" + o.getDescricao() + ")")
                .collect(Collectors.joining("; "));

        String dadosParaIA = String.format(
                "Aluno: %s (Turma %s). NOTAS: [%s]. OCORRÊNCIAS REGISTRADAS: [%s].",
                aluno.getNome(), aluno.getTurma(), resumoNotas, resumoOcorrencias
        );

        System.out.println("🤖 Enviando para IA: " + dadosParaIA);

        return iaService.gerarResposta("Gere um relatório pedagógico", dadosParaIA);
    }

}