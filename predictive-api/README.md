# Sinergia Pro: Serviço de Análise Preditiva de Padrões (FastAPI)

Este microsserviço em Python, construído com **FastAPI**, implementa a funcionalidade de **Análise Preditiva de Padrões** do **Sinergia Pro**. Ele utiliza Inteligência Artificial (via API compatível com OpenAI) para analisar dados clínicos históricos (prontuários, diários e escalas) e identificar padrões de comportamento, gatilhos de crise e o risco de recaída do paciente.

## 1. Pré-requisitos

*   Python 3.8+
*   Chave de API compatível com OpenAI (a variável de ambiente `OPENAI_API_KEY` deve ser configurada).

## 2. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_predictive_api
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

### Endpoint: `POST /api/v1/predictive/analyze`

**Descrição:** Gera a Análise Preditiva a partir dos dados históricos do paciente.

**Corpo da Requisição (JSON):**

```json
{
  "prontuarios_historicos": [
    "Sessão 1: Foco na ansiedade, paciente relata dificuldades no trabalho.",
    "Sessão 5: Melhora na assertividade, mas humor ainda flutuante.",
    "Sessão 10: Paciente relata estresse intenso devido a prazo de projeto."
  ],
  "diarios_paciente": [
    "Me senti muito triste na segunda-feira após briga com o chefe.",
    "Dia bom, consegui fazer exercício e me senti menos ansioso.",
    "Dormi mal, acordei com o coração acelerado e tive dificuldade de concentração."
  ],
  "escalas_recentes": [
    "PHQ-9: 15 (Moderado)",
    "Escore de Humor: 4/10",
    "GAD-7: 12 (Moderado)"
  ]
}
```

**Exemplo de Resposta (JSON):**

```json
{
  "pattern_analysis": "Padrão de humor depressivo e ansioso consistentemente associado a dias de semana (segunda a quarta) e após interações sociais de alta demanda. A qualidade do sono parece ser um fator de risco primário.",
  "trigger_identification": [
    "Conflitos no ambiente de trabalho",
    "Falta de sono (menos de 6 horas)",
    "Pressão por prazos"
  ],
  "recidivism_risk": "Moderado. Justificativa: Aumento do escore de ansiedade nas últimas duas semanas e relato de três gatilhos recentes (trabalho, sono, prazos).",
  "suggested_interventions": [
    "Revisar a técnica de reestruturação cognitiva para lidar com a pressão no trabalho.",
    "Explorar a higiene do sono e estabelecer uma rotina.",
    "Utilizar o Diário Terapêutico Interativo para monitorar a relação entre sono e humor."
  ]
}
```

## 5. Estrutura do Projeto

```
sintropia_predictive_api/
├── main.py             # Aplicação principal FastAPI
├── requirements.txt    # Dependências do Python
└── README.md           # Documentação e instruções de uso
```
