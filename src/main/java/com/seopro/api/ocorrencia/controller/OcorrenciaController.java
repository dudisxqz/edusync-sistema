package com.seopro.api.ocorrencia.controller;

import com.seopro.api.ocorrencia.model.Ocorrencia;
import com.seopro.api.ocorrencia.model.dto.OcorrenciaDTO;
import com.seopro.api.ocorrencia.service.OcorrenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    @Autowired
    private OcorrenciaService service;

    @GetMapping
    public List<Ocorrencia> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Ocorrencia criar(@RequestBody @Valid OcorrenciaDTO dados) {
        return service.criar(dados);
    }

    @Autowired
    private com.seopro.api.infra.service.IAService iaService;

    @PostMapping("/ia/melhorar-texto")
    public String usarIA(@RequestBody String texto) {
        return iaService.melhorarTexto(texto);
    }

}