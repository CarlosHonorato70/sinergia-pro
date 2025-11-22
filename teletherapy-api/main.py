import os
import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from openai import OpenAI

# Configuração do Cliente OpenAI (para a funcionalidade de resumo)
try:
    client = OpenAI()
except Exception as e:
    print(f"Erro ao inicializar o cliente OpenAI: {e}")
    client = None

app = FastAPI(
    title="Sinergia Pro - Serviço de Teleterapia Integrada",
    description="Microsserviço para gerenciamento de salas de teleterapia e transcrição/resumo de sessões.",
    version="1.0.0"
)

# --- Modelos Pydantic ---

class CreateRoomRequest(BaseModel):
    """Modelo de requisição para a criação da sala de teleterapia."""
    session_id: str = Field(..., description="ID único da sessão agendada.")
    therapist_name: str = Field(..., description="Nome do terapeuta.")
    patient_name: str = Field(..., description="Nome do paciente.")
    start_time: str = Field(..., description="Horário de início da sessão (ISO 8601).")

class CreateRoomResponse(BaseModel):
    """Modelo de resposta com os links da sala de teleterapia."""
    room_id: str = Field(..., description="ID único da sala de reunião criada.")
    therapist_link: str = Field(..., description="Link de acesso seguro para o terapeuta.")
    patient_link: str = Field(..., description="Link de acesso seguro para o paciente.")

class TranscribeRequest(BaseModel):
    """Modelo de requisição para o processamento de transcrição."""
    audio_file_url: str = Field(..., description="URL pública do arquivo de áudio da sessão.")
    therapist_id: str = Field(..., description="ID do terapeuta (para contexto).")

class TranscribeResponse(BaseModel):
    """Modelo de resposta com a transcrição e o resumo inicial."""
    transcription_text: str = Field(..., description="Transcrição completa da sessão.")
    summary_initial: str = Field(..., description="Resumo inicial gerado pela IA.")
    speaker_identification: str = Field(..., description="Indicação de quem falou (Terapeuta/Paciente).")

# --- Endpoint 1: Criação de Sala ---

@app.post("/api/v1/teletherapy/create_room", response_model=CreateRoomResponse)
async def create_teletherapy_room(request_data: CreateRoomRequest):
    """
    Simula a criação de uma sala de teleterapia segura e gera links de acesso.
    Em um ambiente real, esta função integraria com um serviço de WebRTC (ex: Twilio, Daily.co).
    """
    room_id = f"ROOM-{uuid.uuid4().hex[:8].upper()}"
    base_url = "https://teletherapy.sintropiapro.com/join" # URL fictícia para o frontend
    
    return CreateRoomResponse(
        room_id=room_id,
        therapist_link=f"{base_url}/{room_id}?role=therapist&session={request_data.session_id}",
        patient_link=f"{base_url}/{room_id}?role=patient&session={request_data.session_id}"
    )

# --- Endpoint 2: Transcrição e Resumo ---

def generate_summary_with_ai(transcription: str) -> str:
    """
    Gera um resumo inicial da transcrição para o Prontuário 2.0.
    """
    if not client:
        return "[MOCK] Resumo inicial: Serviço de IA indisponível."

    system_prompt = "Você é um assistente de IA que recebe a transcrição de uma sessão de terapia. Sua tarefa é gerar um resumo inicial conciso e profissional da sessão, destacando os principais tópicos e emoções observadas. O resumo será usado como base para o Prontuário 2.0."
    
    user_prompt = f"Transcriçao da Sessão:\n\n{transcription}"
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Erro na chamada da API de IA para resumo: {e}")
        return "[MOCK] Resumo inicial: Falha ao gerar resumo com IA."


@app.post("/api/v1/teletherapy/transcribe", response_model=TranscribeResponse)
async def process_transcription(request_data: TranscribeRequest):
    """
    Simula o processamento de um arquivo de áudio (transcrição e resumo inicial).
    Em um ambiente real, esta função faria o download do áudio e usaria um modelo de Speech-to-Text (ex: Whisper).
    """
    # Simulação de Transcrição (em um ambiente real, usaria um modelo STT)
    # Para fins de demonstração, vamos usar um texto mock que simula uma transcrição
    mock_transcription = (
        "Terapeuta: Como você se sentiu esta semana, Ana? "
        "Paciente: Tive altos e baixos. A ansiedade voltou forte na segunda, depois daquela reunião com o chefe. "
        "Terapeuta: E o que você pensou naquele momento? "
        "Paciente: Pensei que não era boa o suficiente. "
        "Terapeuta: Certo. Vamos trabalhar essa crença na próxima sessão. "
        "Paciente: Combinado. Me senti melhor depois de falar sobre isso."
    )
    
    # Simulação de Identificação de Falantes
    speaker_id = "Terapeuta e Paciente (Identificação de Falantes Simulada)"
    
    # Geração do Resumo Inicial com IA
    summary = generate_summary_with_ai(mock_transcription)
    
    return TranscribeResponse(
        transcription_text=mock_transcription,
        summary_initial=summary,
        speaker_identification=speaker_id
    )

# --- Endpoint de Saúde (Health Check) ---

@app.get("/health")
async def health_check():
    """Verifica se o serviço está ativo."""
    return {"status": "ok", "service": "Sinergia Pro Teleterapia API"}

# Para rodar localmente: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
