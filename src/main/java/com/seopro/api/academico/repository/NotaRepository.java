package com.seopro.api.academico.repository;

import com.seopro.api.academico.model.Nota;
import com.seopro.api.aluno.model.Aluno; // Importante importar o Aluno
import com.seopro.api.aluno.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.materia = :materia")
    Double obterMediaDaTurma(@Param("materia") Materia materia);

    boolean existsByAlunoAndMateriaAndBimestre(Aluno aluno, Materia materia, Integer bimestre);
}