package com.seopro.api.auth.controller;

import com.seopro.api.auth.model.Usuario;
import com.seopro.api.auth.model.dto.DadosAlteracaoSenha;
import com.seopro.api.auth.repository.UsuarioRepository;
import com.seopro.api.aluno.repository.AlunoRepository;
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

    @Autowired
    private AlunoRepository alunoRepository; // Injete o repositório de alunos

    // ... (outros métodos) ...

    @GetMapping("/{id}/dados-pessoais")
    public ResponseEntity buscarDadosPessoais(@PathVariable Long id) {
        var usuario = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Se for ALUNO, busca na tabela de alunos pelo nome (ou idealmente teria um vínculo direto)
        // Como simplificamos o modelo e não temos chave estrangeira Usuario -> Aluno,
        // vamos buscar o aluno que tem o mesmo NOME do login (para fins de demonstração)
        // ou você pode criar um campo 'usuario_id' na tabela Aluno depois.

        if (usuario.getPerfil() == Usuario.Perfil.ALUNO) {
            // Busca um aluno que tenha o nome parecido com o login (Ex: 'joao' -> 'João Silva')
            // Isso é uma simulação. Em produção, o aluno teria um usuario_id.
            var aluno = alunoRepository.findAll().stream()
                    .filter(a -> a.getNome().toLowerCase().contains(usuario.getLogin().toLowerCase()))
                    .findFirst();

            if (aluno.isPresent()) {
                return ResponseEntity.ok(aluno.get());
            }
        }

        return ResponseEntity.notFound().build();
    }

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