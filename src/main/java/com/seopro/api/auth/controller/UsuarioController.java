package com.seopro.api.auth.controller;

import com.seopro.api.auth.model.Usuario;
import com.seopro.api.auth.model.dto.DadosAlteracaoSenha;
import com.seopro.api.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/{id}/senha")
    public ResponseEntity alterarSenha(@PathVariable Long id, @RequestBody DadosAlteracaoSenha dados) {
        var usuario = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 1. Verifica se a senha antiga bate com a do banco
        if (!passwordEncoder.matches(dados.senhaAntiga(), usuario.getPassword())) {
            return ResponseEntity.badRequest().body("A senha atual está incorreta.");
        }

        // 2. Criptografa a nova senha e salva
        String novaSenhaCriptografada = passwordEncoder.encode(dados.novaSenha());
        usuario.setSenha(novaSenhaCriptografada);
        repository.save(usuario);

        return ResponseEntity.ok().build();
    }
}