# Sinergia Pro: Serviço de Teleterapia Integrada (FastAPI)

Este microsserviço em Python, construído com **FastAPI**, implementa a funcionalidade de **Teleterapia Integrada** do **Sinergia Pro**. Ele gerencia a criação de salas de reunião seguras e simula o processamento de áudio pós-sessão para **transcrição e resumo inicial** utilizando IA.

## 1. Pré-requisitos

*   Python 3.8+
*   Chave de API compatível com OpenAI (a variável de ambiente `OPENAI_API_KEY` deve ser configurada para a funcionalidade de resumo).

## 2. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_teletherapy_api
    ```

2.  **Instale as dependências:**
    ```bash
    pip3 install -r requirements.txt
    ```

3.  **Configure a Chave de API (Opcional, para resumo com IA):**
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

O serviço expõe dois endpoints principais.

### Endpoint 1: `POST /api/v1/teletherapy/create_room`

**Descrição:** Cria uma sala de teleterapia segura e gera links de acesso.

**Corpo da Requisição (JSON):**

```json
{
  "session_id": "SESS-20251120-001",
  "therapist_name": "Dr. Carlos Silva",
  "patient_name": "Ana Souza",
  "start_time": "2025-11-20T10:00:00Z"
}
```

**Exemplo de Resposta (JSON):**

```json
{
  "room_id": "ROOM-XYZ-12345",
  "therapist_link": "https://teletherapy.sintropiapro.com/join/ROOM-XYZ-12345?role=therapist&session=SESS-20251120-001",
  "patient_link": "https://teletherapy.sintropiapro.com/join/ROOM-XYZ-12345?role=patient&session=SESS-20251120-001"
}
```

### Endpoint 2: `POST /api/v1/teletherapy/transcribe`

**Descrição:** Simula o processamento de áudio, retornando a transcrição e um resumo inicial gerado por IA.

**Corpo da Requisição (JSON):**

```json
{
  "audio_file_url": "https://s3.aws.com/sintropia/audio/SESS-001.mp3",
  "therapist_id": "T-456"
}
```

**Exemplo de Resposta (JSON):**

```json
{
  "transcription_text": "Terapeuta: Como você se sentiu esta semana, Ana? Paciente: Tive altos e baixos. A ansiedade voltou forte na segunda, depois daquela reunião com o chefe. Terapeuta: E o que você pensou naquele momento? Paciente: Pensei que não era boa o suficiente. Terapeuta: Certo. Vamos trabalhar essa crença na próxima sessão. Paciente: Combinado. Me senti melhor depois de falar sobre isso.",
  "summary_initial": "Sessão focada na avaliação da ansiedade do paciente, que foi desencadeada por uma reunião de trabalho. O paciente identificou um pensamento automático de baixa autoeficácia. O terapeuta propôs trabalhar essa crença na próxima sessão.",
  "speaker_identification": "Terapeuta e Paciente (Identificação de Falantes Simulada)"
}
```

## 5. Estrutura do Projeto

```
sintropia_teletherapy_api/
├── main.py             # Aplicação principal FastAPI
├── requirements.txt    # Dependências do Python
└── README.md           # Documentação e instruções de uso
```
