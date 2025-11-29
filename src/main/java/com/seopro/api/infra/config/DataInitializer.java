package com.seopro.api.infra.config;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.repository.AlunoRepository;
import com.seopro.api.auth.model.Usuario;
import com.seopro.api.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        // 1. CRIAÇÃO DE USUÁRIOS (LOGIN)
        if (usuarioRepository.count() == 0) {
            String senha = new BCryptPasswordEncoder().encode("123456");
            Usuario diretor = new Usuario("diretor", senha, Usuario.Perfil.ADMIN);
            Usuario pai = new Usuario("pai", senha, Usuario.Perfil.RESPONSAVEL);
            usuarioRepository.saveAll(Arrays.asList(diretor, pai));
            System.out.println("🔐 USUÁRIOS CRIADOS: Login 'diretor' e 'pai' (Senha 123456)");
        }

        // 2. CRIAÇÃO DE ALUNOS (POPULAÇÃO EM MASSA)
        if (alunoRepository.count() == 0) {
            List<Aluno> listaAlunos = new ArrayList<>();

            // --- TURMA DO JOÃO (3º A) ---
            // O Aluno Principal
            Aluno joao = new Aluno();
            joao.setNome("João Silva");
            joao.setTurma("3º Ano A");
            joao.setMatricula("2025001");
            listaAlunos.add(joao);

            // Gera mais 29 alunos aleatórios para o 3º A
            listaAlunos.addAll(gerarTurma("3º Ano A", 2025100, 29));


            // --- TURMA DA MARIA (2º B) ---
            // A Aluna Principal
            Aluno maria = new Aluno();
            maria.setNome("Maria Oliveira");
            maria.setTurma("2º Ano B");
            maria.setMatricula("2025002");
            listaAlunos.add(maria);

            // Gera mais 29 alunos aleatórios para o 2º B
            listaAlunos.addAll(gerarTurma("2º Ano B", 2025200, 29));

            // Salva todo mundo de uma vez (Performance!)
            alunoRepository.saveAll(listaAlunos);
            System.out.println("✅ --- BANCO DE DADOS POPULADO COM " + listaAlunos.size() + " ALUNOS ---");
        }
    }

    // --- MÁQUINA DE GERAR NOMES ALEATÓRIOS ---
    private List<Aluno> gerarTurma(String nomeTurma, int matriculaInicial, int quantidade) {
        List<Aluno> turma = new ArrayList<>();

        String[] nomes = {
                "Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena",
                "Igor", "Julia", "Kaique", "Larissa", "Lucas", "Mariana", "Nicolas", "Olivia",
                "Pedro", "Rafael", "Sofia", "Thiago", "Vitoria", "Wesley", "Yasmin", "Zeca"
        };

        String[] sobrenomes = {
                "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima",
                "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares"
        };

        Random random = new Random();

        for (int i = 0; i < quantidade; i++) {
            Aluno a = new Aluno();

            // Pega um nome aleatório e um sobrenome aleatório
            String nomeCompleto = nomes[random.nextInt(nomes.length)] + " " +
                    sobrenomes[random.nextInt(sobrenomes.length)];

            a.setNome(nomeCompleto);
            a.setTurma(nomeTurma);
            a.setMatricula(String.valueOf(matriculaInicial + i));

            turma.add(a);
        }

        return turma;
    }
}