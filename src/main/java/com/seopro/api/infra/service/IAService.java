package com.seopro.api.infra.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IAService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";


    public String gerarResposta(String promptDoSistema, String dadosDoUsuario) {
        if (dadosDoUsuario == null || dadosDoUsuario.isBlank()) {
            return "Não há dados suficientes para gerar uma resposta.";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            String dadosSeguros = dadosDoUsuario.replace("\n", " ").replace("\"", "'");
            String promptSeguro = promptDoSistema.replace("\n", " ").replace("\"", "'");

            String requestBody = """
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "%s"
                        },
                        {
                            "role": "user",
                            "content": "%s"
                        }
                    ],
                    "temperature": 0.7
                }
                """.formatted(promptSeguro, dadosSeguros);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);


            ResponseEntity<String> response = restTemplate.postForEntity(OPENAI_URL, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            return root.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Erro ao processar IA. Verifique a chave de API ou a conexão. Detalhe: " + e.getMessage();
        }
    }

    public String melhorarTexto(String textoOriginal) {
        String prompt = "Reescreva a seguinte ocorrência escolar de forma formal, pedagógica e objetiva para um relatório oficial.";
        return gerarResposta(prompt, textoOriginal);
    }
}