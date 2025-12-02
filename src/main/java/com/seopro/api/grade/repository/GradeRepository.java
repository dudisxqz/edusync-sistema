package com.seopro.api.grade.repository;

import com.seopro.api.grade.model.GradeHoraria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<GradeHoraria, Long> {
    List<GradeHoraria> findByTurma(String turma);

    // Novo método para encontrar aula específica (para substituir)
    Optional<GradeHoraria> findByTurmaAndDiaAndHorario(
            String turma,
            GradeHoraria.DiaSemana dia,
            GradeHoraria.HorarioAula horario
    );
}