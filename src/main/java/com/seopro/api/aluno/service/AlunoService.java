package com.seopro.api.aluno.service;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.model.Aluno.SituacaoMatricula;
import com.seopro.api.aluno.model.dto.AlunoDTO;
import com.seopro.api.aluno.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository repository;

    public List<Aluno> listarTodos() {
        return repository.findAll();
    }

    public Aluno buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
    }

    public Aluno criar(AlunoDTO dados) {
        Aluno aluno = new Aluno();
        aluno.setNome(dados.nome());
        aluno.setTurma(dados.turma());
        aluno.setMatricula(dados.matricula());
        // Se vier status, usa. Se não, usa o padrão (ATIVO)
        if (dados.situacao() != null) {
            aluno.setSituacao(dados.situacao());
        }
        return repository.save(aluno);
    }

    // Lógica para atualizar status
    public Aluno atualizarStatus(Long id, SituacaoMatricula novaSituacao) {
        Aluno aluno = buscarPorId(id);
        aluno.setSituacao(novaSituacao);
        return repository.save(aluno);
    }
}