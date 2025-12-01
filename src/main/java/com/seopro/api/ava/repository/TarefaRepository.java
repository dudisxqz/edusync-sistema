package com.seopro.api.ava.repository;

import com.seopro.api.ava.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    List<Tarefa> findByTurma(String turma);
}