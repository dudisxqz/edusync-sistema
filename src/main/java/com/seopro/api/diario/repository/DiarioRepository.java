package com.seopro.api.diario.repository;
import com.seopro.api.diario.model.DiarioClasse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiarioRepository extends JpaRepository<DiarioClasse, Long> {}