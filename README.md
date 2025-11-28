# 🏫 SEOP-RO — Sistema Escolar de Ocorrências e Pedagogia

> Sistema Full Stack para gestão de ocorrências escolares, visando facilitar a comunicação entre professores e coordenação pedagógica.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring-Boot-green)
![React](https://img.shields.io/badge/React-Vite-blue)

## 🎯 O Problema
Escolas públicas muitas vezes dependem de registros em papel para ocorrências disciplinares (atrasos, comportamento, tarefas). Isso dificulta a geração de histórico e a tomada de decisão pedagógica.

## 💡 A Solução
O **SEOP-RO** digitaliza esse processo. O professor seleciona o aluno, e o sistema já identifica a turma automaticamente. O registro é salvo em banco de dados e exibido em um Dashboard em tempo real para a coordenação.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Java 17** & **Spring Boot 3**
- **Spring Data JPA** (Persistência de dados)
- **H2 Database** (Banco em memória para testes rápidos)
- **DTO Pattern** (Data Transfer Object para segurança dos dados)
- **Architecture:** Package by Feature (Organização por domínio: Aluno/Ocorrência)

### Frontend (Interface)
- **React.js** com **Vite** (Performance)
- **Axios** (Consumo de API REST)
- **React Router DOM** (Navegação SPA)
- **CSS Modules** (Estilização limpa e responsiva)

---

## 🚀 Como rodar o projeto

Este é um mono-repo contendo Backend e Frontend.

### 1️⃣ Rodando o Backend (API)
1. Abra a pasta raiz no IntelliJ (ou sua IDE Java favorita).
2. Aguarde o Maven baixar as dependências.
3. Execute a classe `SeopApplication.java`.
4. O Backend rodará em: `http://localhost:8080`.
    * *Nota: O sistema popula o banco automaticamente com alunos fictícios ao iniciar.*

### 2️⃣ Rodando o Frontend (Web)
1. Abra o terminal na pasta `seop-web`:
   ```bash
   cd seop-web