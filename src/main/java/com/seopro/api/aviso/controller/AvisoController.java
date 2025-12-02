package com.seopro.api.aviso.controller;

import com.seopro.api.aviso.model.Aviso;
import com.seopro.api.aviso.model.dto.AvisoDTO;
import com.seopro.api.aviso.repository.AvisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/avisos")
public class AvisoController {

    @Autowired
    private AvisoRepository repository;

    @GetMapping
    public List<Aviso> listarGeral() {
        return repository.findAll();
    }

    @PostMapping
    public Aviso criar(@RequestBody AvisoDTO dados) {
        Aviso aviso = new Aviso();
        aviso.setTitulo(dados.titulo());
        aviso.setMensagem(dados.mensagem());
        aviso.setTurmaAlvo(dados.turmaAlvo());
        aviso.setDataPostagem(LocalDate.now());

        return repository.save(aviso);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}