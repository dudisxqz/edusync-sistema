package com.seopro.api.auth.controller;

import com.seopro.api.auth.model.Usuario;
import com.seopro.api.auth.model.dto.DadosAutenticacao;
import com.seopro.api.auth.model.dto.DadosTokenJWT;
import com.seopro.api.infra.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var tokenDeAutenticacao = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(tokenDeAutenticacao);

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuarioLogado);

        // AGORA ENVIAMOS O ID JUNTO!
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioLogado.getPerfil().toString(), usuarioLogado.getId()));
    }
}