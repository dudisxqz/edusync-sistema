package com.seopro.api.infra.config;

import com.seopro.api.aluno.model.Aluno;
import com.seopro.api.aluno.repository.AlunoRepository;
import com.seopro.api.auth.model.Usuario;
import com.seopro.api.auth.repository.UsuarioRepository;
import com.seopro.api.ava.model.Tarefa;
import com.seopro.api.ava.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private TarefaRepository tarefaRepository;

    @Override
    public void run(String... args) throws Exception {

        // 1. CRIAÇÃO DE USUÁRIOS (TODOS OS PERFIS)
        if (usuarioRepository.count() == 0) {
            String senha = new BCryptPasswordEncoder().encode("123456");

            // Equipe Escolar
            Usuario diretor = new Usuario("diretor", senha, Usuario.Perfil.ADMIN);
            Usuario coord = new Usuario("coord", senha, Usuario.Perfil.COORDENADOR);
            Usuario sec = new Usuario("secretaria", senha, Usuario.Perfil.SECRETARIA);
            Usuario prof = new Usuario("prof", senha, Usuario.Perfil.PROFESSOR);

            // Família/Aluno
            Usuario pai = new Usuario("pai", senha, Usuario.Perfil.RESPONSAVEL);
            Usuario alunoUser = new Usuario("aluno", senha, Usuario.Perfil.ALUNO);

            usuarioRepository.saveAll(Arrays.asList(diretor, coord, sec, prof, pai, alunoUser));

            System.out.println("🔐 USUÁRIOS CRIADOS (Senha 123456):");
            System.out.println("   - diretor (Admin)");
            System.out.println("   - coord (Coordenador)");
            System.out.println("   - secretaria (Secretaria)");
            System.out.println("   - prof (Professor)");
            System.out.println("   - pai (Responsável)");
            System.out.println("   - aluno (Aluno)");
        }

        // 2. POPULAÇÃO DE ALUNOS
        if (alunoRepository.count() == 0) {
            List<Aluno> listaAlunos = new ArrayList<>();

            Aluno joao = new Aluno(); joao.setNome("João Silva"); joao.setTurma("3º Ano A"); joao.setMatricula("2025001");
            listaAlunos.add(joao);
            listaAlunos.addAll(gerarTurma("3º Ano A", 2025100, 29));

            Aluno maria = new Aluno(); maria.setNome("Maria Oliveira"); maria.setTurma("2º Ano B"); maria.setMatricula("2025002");
            listaAlunos.add(maria);
            listaAlunos.addAll(gerarTurma("2º Ano B", 2025200, 29));

            alunoRepository.saveAll(listaAlunos);
            System.out.println("✅ --- BANCO DE DADOS POPULADO COM ALUNOS ---");
        }

        // 3. TAREFAS
        if (tarefaRepository.count() == 0) {
            Tarefa t1 = new Tarefa();
            t1.setTitulo("Frações"); t1.setDescricao("Pág 45."); t1.setDataEntrega(LocalDate.now().plusDays(3)); t1.setTurma("3º Ano A"); t1.setMateria("MATEMATICA");
            tarefaRepository.save(t1);
        }
    }

    private List<Aluno> gerarTurma(String nomeTurma, int matriculaInicial, int quantidade) {
        List<Aluno> turma = new ArrayList<>();
        String[] nomes = {"Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda"};
        String[] sobrenomes = {"Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira"};
        Random random = new Random();

        for (int i = 0; i < quantidade; i++) {
            Aluno a = new Aluno();
            String nomeCompleto = nomes[random.nextInt(nomes.length)] + " " + sobrenomes[random.nextInt(sobrenomes.length)];
            a.setNome(nomeCompleto);
            a.setTurma(nomeTurma);
            a.setMatricula(String.valueOf(matriculaInicial + i));
            turma.add(a);
        }
        return turma;
    }
}