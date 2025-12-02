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

        // Dados Aluno
        aluno.setNome(dados.nome());
        aluno.setDataNascimento(dados.dataNascimento());
        aluno.setCpf(dados.cpf());
        aluno.setTelefone(dados.telefone());
        aluno.setEndereco(dados.endereco());

        // Dados Responsável
        aluno.setNomeResponsavel(dados.nomeResponsavel());
        aluno.setCpfResponsavel(dados.cpfResponsavel());
        aluno.setTelefoneResponsavel(dados.telefoneResponsavel());
        aluno.setEmailResponsavel(dados.emailResponsavel());

        // Dados Escolares
        aluno.setEscola(dados.escola());
        aluno.setSerie(dados.serie());
        aluno.setTurma(dados.turma());
        aluno.setDataMatricula(dados.dataMatricula());
        aluno.setMatricula(dados.matricula());

        if (dados.situacao() != null) {
            aluno.setSituacao(dados.situacao());
        }

        return repository.save(aluno);
    }

    public Aluno atualizarStatus(Long id, SituacaoMatricula situacao) {
        return null;
    }
}