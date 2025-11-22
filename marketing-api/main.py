import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from openai import OpenAI

# Configuração do Cliente OpenAI
try:
    client = OpenAI()
except Exception as e:
    print(f"Erro ao inicializar o cliente OpenAI: {e}")
    client = None

app = FastAPI(
    title="Sinergia Pro - Serviço de Agente de Marketing 2.0",
    description="Microsserviço para geração de conteúdo de marketing personalizado com IA.",
    version="1.0.0"
)

# --- Modelos Pydantic ---

class MarketingRequest(BaseModel):
    """Modelo de requisição para a geração de conteúdo de marketing."""
    topic: str = Field(..., description="O tema central para o conteúdo.")
    format: str = Field(..., description="O formato do conteúdo desejado (ex: 'Instagram Post', 'Blog Article').")
    target_audience: str = Field(..., description="O público-alvo do conteúdo.")
    tone: str = Field(..., description="O tom de voz desejado (ex: 'Empático e informativo').")
    therapist_expertise: str = Field(..., description="Breve descrição da expertise do terapeuta.")

class MarketingResponse(BaseModel):
    """Modelo de resposta com o conteúdo de marketing gerado."""
    title: str = Field(..., description="Título sugerido para o conteúdo.")
    content: str = Field(..., description="O corpo do texto gerado.")
    hashtags: List[str] = Field(..., description="Lista de hashtags relevantes (se aplicável).")
    call_to_action: str = Field(..., description="Sugestão de chamada para ação.")

# --- Lógica de Geração de Conteúdo com IA ---

def generate_marketing_content_with_ai(data: MarketingRequest) -> MarketingResponse:
    """
    Função principal que interage com o modelo de linguagem para gerar o conteúdo.
    """
    if not client:
        # Retorna um mock em caso de falha na inicialização do cliente
        return MarketingResponse(
            title="[MOCK] Título de Marketing",
            content="[MOCK] Conteúdo: Serviço de IA indisponível. Foco: " + data.topic,
            hashtags=["#mock", "#marketing"],
            call_to_action="[MOCK] Agende uma sessão."
        )

    # Construção do Prompt para o LLM
    
    system_prompt = f"""
    Você é um Agente de Marketing de Inteligência Artificial especializado em criar conteúdo para psicólogos.
    Sua tarefa é gerar um conteúdo de marketing persuasivo e informativo, seguindo as especificações do usuário.
    
    O output deve ser um objeto JSON que contenha exatamente os campos: 'title', 'content', 'hashtags' (lista de strings) e 'call_to_action'.
    
    Instruções:
    1. 'title': Crie um título atraente para o formato '{data.format}'.
    2. 'content': Desenvolva o corpo do texto com o tom '{data.tone}', focando no público '{data.target_audience}' e incorporando a expertise do terapeuta.
    3. 'hashtags': Gere 3 a 5 hashtags relevantes (se o formato for para redes sociais).
    4. 'call_to_action': Crie uma chamada para ação clara e direta.
    """

    user_prompt = f"""
    Tema: {data.topic}
    Formato: {data.format}
    Público-Alvo: {data.target_audience}
    Tom de Voz: {data.tone}
    Expertise do Terapeuta: {data.therapist_expertise}
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash", # Usando o modelo disponível
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        # O modelo deve retornar um JSON que se encaixe no MarketingResponse
        import json
        ai_output = json.loads(response.choices[0].message.content)
        
        # Validação e retorno do modelo Pydantic
        return MarketingResponse(**ai_output)

    except Exception as e:
        print(f"Erro na chamada da API de IA: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao gerar conteúdo de marketing com IA: {e}")

# --- Endpoint da API ---

@app.post("/api/v1/marketing/generate_content", response_model=MarketingResponse)
async def generate_marketing_content(request_data: MarketingRequest):
    """
    Gera conteúdo de marketing personalizado utilizando Inteligência Artificial.
    """
    return generate_marketing_content_with_ai(request_data)

# --- Endpoint de Saúde (Health Check) ---

@app.get("/health")
async def health_check():
    """Verifica se o serviço está ativo."""
    return {"status": "ok", "service": "Sinergia Pro Marketing Agent 2.0 API"}

# Para rodar localmente: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
