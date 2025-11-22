# Sinergia Pro: Serviço de Geração de Prontuário 2.0 (FastAPI)

Este microsserviço em Python, construído com **FastAPI**, é um componente central do **Sinergia Pro**. Ele utiliza Inteligência Artificial (via API compatível com OpenAI) para gerar prontuários clínicos avançados (Prontuário 2.0), incluindo resumo da sessão, análise de progresso e sugestões de objetivos terapêuticos.

## 1. Pré-requisitos

*   Python 3.8+
*   Chave de API compatível com OpenAI (a variável de ambiente `OPENAI_API_KEY` deve ser configurada).

## 2. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_prontuario_api
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
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O serviço estará acessível em `http://localhost:8000`.

## 4. Uso da API

O serviço expõe um único endpoint principal.

### Endpoint: `POST /api/v1/prontuario/generate`

**Descrição:** Gera o Prontuário 2.0 a partir dos dados da sessão e do histórico do paciente.

**Corpo da Requisição (JSON):**

```json
{
  "session_notes": "Paciente relatou melhora na ansiedade, mas dificuldade em aplicar a técnica de respiração. Foco na reestruturação cognitiva.",
  "patient_history": "Histórico de TAG e depressão leve. Iniciou terapia há 3 meses. Objetivos iniciais: reduzir crises de ansiedade e melhorar a qualidade do sono.",
  "therapeutic_goals": [
    "Reduzir a frequência de crises de ansiedade",
    "Melhorar a assertividade em relações interpessoais"
  ],
  "model_theory": "Terapia Cognitivo-Comportamental (TCC)"
}
```

**Exemplo de Resposta (JSON):**

```json
{
  "session_summary": "Sessão focada na avaliação da aplicação de técnicas de TCC. Identificada resistência na técnica de respiração. Foi realizada reestruturação cognitiva sobre crenças de autoeficácia.",
  "progress_analysis": "Progresso notável no objetivo de redução de crises de ansiedade (de 3/semana para 1/semana). O objetivo de assertividade requer mais foco nas próximas sessões.",
  "suggested_objectives": [
    "Reforçar a prática da técnica de respiração com exercícios diários",
    "Explorar as crenças limitantes relacionadas à assertividade"
  ],
  "prontuario_completo": "## Prontuário Clínico - Sessão [Data]\n\n**Resumo da Sessão:** Sessão focada na avaliação da aplicação de técnicas de TCC. Identificada resistência na técnica de respiração. Foi realizada reestruturação cognitiva sobre crenças de autoeficácia.\n\n**Análise de Progresso:** Progresso notável no objetivo de redução de crises de ansiedade (de 3/semana para 1/semana). O objetivo de assertividade requer mais foco nas próximas sessões.\n\n**Próximos Passos:** Reforçar a prática da técnica de respiração com exercícios diários e explorar as crenças limitantes relacionadas à assertividade."
}
```

### Endpoint de Saúde: `GET /health`

**Descrição:** Verifica se o serviço está ativo.

**Resposta:**
```json
{
  "status": "ok",
  "service": "Sinergia Pro Prontuário 2.0 API"
}
```

## 5. Estrutura do Projeto

```
sintropia_prontuario_api/
├── main.py             # Aplicação principal FastAPI
├── requirements.txt    # Dependências do Python
└── README.md           # Documentação e instruções de uso
```
