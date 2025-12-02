package com.seopro.api.auth.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String login;
    private String senha;

    @Enumerated(EnumType.STRING)
    private Perfil perfil;

    // --- PERFIS UNIFICADOS ---
    public enum Perfil {
        ADMIN,          // Coordenação Pedagógica (Antigo Diretor + Coord)
        SECRETARIA,     // Secretaria Escolar
        PROFESSOR,      // Docente
        RESPONSAVEL,    // Pais
        ALUNO           // Estudante
    }

    public Usuario() {}
    public Usuario(String login, String senha, Perfil perfil) {
        this.login = login;
        this.senha = senha;
        this.perfil = perfil;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }
    @Override public String getPassword() { return senha; }
    @Override public String getUsername() { return login; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}