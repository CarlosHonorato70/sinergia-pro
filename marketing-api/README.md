# Sinergia Pro: Serviço de Agente de Marketing 2.0 (FastAPI)

Este microsserviço em Python, construído com **FastAPI**, implementa o **Agente de Marketing 2.0** do **Sinergia Pro**. Ele utiliza Inteligência Artificial (via API compatível com OpenAI) para gerar conteúdo de marketing personalizado para psicólogos, como posts para redes sociais e artigos de blog.

## 1. Pré-requisitos

*   Python 3.8+
*   Chave de API compatível com OpenAI (a variável de ambiente `OPENAI_API_KEY` deve ser configurada).

## 2. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_marketing_api
    ```

2.  **Instale as dependências:**
    ```bash
    pip3 install -r requirements.txt
    ```

3.  **Configure a Chave de API:**
    Defina sua chave de API como uma variável de ambiente.
    ```bash
    export OPENAI_API_KEY="SUA_CHAVE_DE_API_AQUI"
    ```

## 3. Execução do Serviço

Inicie o servidor usando `uvicorn`:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8004
```

O serviço estará acessível em `http://localhost:8004`.

## 4. Uso da API

### Endpoint: `POST /api/v1/marketing/generate_content`

**Descrição:** Gera conteúdo de marketing personalizado.

**Corpo da Requisição (JSON):**

```json
{
  "topic": "Como a TCC ajuda na ansiedade",
  "format": "Instagram Post",
  "target_audience": "Jovens adultos com ansiedade leve",
  "tone": "Empático e informativo",
  "therapist_expertise": "Especialista em TCC e Mindfulness"
}
```

**Exemplo de Resposta (JSON):**

```json
{
  "title": "Ansiedade Sob Controle: 3 Passos da TCC",
  "content": "A Terapia Cognitivo-Comportamental (TCC) é uma das abordagens mais eficazes para lidar com a ansiedade. Como especialista em TCC e Mindfulness, posso te guiar em 3 passos simples para começar a mudar seus padrões de pensamento...",
  "hashtags": [
    "#TCC",
    "#Ansiedade",
    "#SaudeMental",
    "#Psicologia"
  ],
  "call_to_action": "Agende sua primeira sessão via link na bio!"
}
```

## 5. Estrutura do Projeto

```
sintropia_marketing_api/
├── main.py             # Aplicação principal FastAPI
├── requirements.txt    # Dependências do Python
└── README.md           # Documentação e instruções de uso
```
