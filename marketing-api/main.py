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

class MarketingMetrics(BaseModel):
    """Modelo para as métricas de performance do conteúdo."""
    impressions: int = Field(..., description="Número de impressões/visualizações.")
    likes: int = Field(..., description="Número de curtidas/reações.")
    comments: int = Field(..., description="Número de comentários.")
    shares: int = Field(..., description="Número de compartilhamentos.")

class MarketingPerformanceRequest(BaseModel):
    """Modelo de requisição para a análise de performance de marketing."""
    content_title: str = Field(..., description="Título do conteúdo que está sendo analisado.")
    content_body: str = Field(..., description="O corpo do texto original.")
    platform: str = Field(..., description="Plataforma onde o conteúdo foi publicado (ex: 'Instagram', 'Blog').")
    metrics: MarketingMetrics = Field(..., description="Métricas de performance do conteúdo.")
    goal: str = Field(..., description="O objetivo principal do conteúdo (ex: 'Aumentar o engajamento', 'Gerar leads').")

class MarketingPerformanceResponse(BaseModel):
    """Modelo de resposta com a análise de performance e sugestões de otimização."""
    performance_summary: str = Field(..., description="Resumo da performance do conteúdo (IA).")
    optimization_suggestions: List[str] = Field(..., description="Sugestões de otimização geradas pela IA.")
    new_call_to_action: str = Field(..., description="Sugestão de uma nova chamada para ação otimizada.")

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

# --- Lógica de Análise de Performance com IA ---

def analyze_marketing_performance_with_ai(data: MarketingPerformanceRequest) -> MarketingPerformanceResponse:
    """
    Função principal que interage com o modelo de linguagem para analisar a performance e sugerir otimizações.
    """
    if not client:
        return MarketingPerformanceResponse(
            performance_summary="[MOCK] Análise indisponível. Serviço de IA indisponível.",
            optimization_suggestions=["[MOCK] Verificar a conexão com a API de IA."],
            new_call_to_action="[MOCK] Tente novamente mais tarde."
        )

    system_prompt = f"""
    Você é um Agente de Marketing de Inteligência Artificial especializado em otimização de conteúdo para psicólogos.
    Sua tarefa é analisar a performance de um conteúdo de marketing com base nas métricas fornecidas e gerar um resumo da performance, sugestões de otimização e uma nova chamada para ação (CTA).
    
    O output deve ser um objeto JSON que contenha exatamente os campos: 'performance_summary', 'optimization_suggestions' (lista de strings) e 'new_call_to_action'.
    
    Instruções:
    1. 'performance_summary': Crie um resumo conciso da performance em relação ao objetivo '{data.goal}'.
    2. 'optimization_suggestions': Gere 3 sugestões de otimização específicas para a plataforma '{data.platform}'.
    3. 'new_call_to_action': Crie uma CTA otimizada para melhorar a performance.
    """

    user_prompt = f"""
    Análise de Performance para o conteúdo: "{data.content_title}"
    Corpo do Conteúdo: {data.content_body}
    Plataforma: {data.platform}
    Métricas: Impressões={data.metrics.impressions}, Curtidas={data.metrics.likes}, Comentários={data.metrics.comments}, Compartilhamentos={data.metrics.shares}
    Objetivo: {data.goal}
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        import json
        ai_output = json.loads(response.choices[0].message.content)
        
        return MarketingPerformanceResponse(**ai_output)

    except Exception as e:
        print(f"Erro na chamada da API de IA para análise de performance: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao analisar performance de marketing com IA: {e}")

@app.post("/api/v1/marketing/analyze_performance", response_model=MarketingPerformanceResponse)
async def analyze_marketing_performance(request_data: MarketingPerformanceRequest):
    """
    Analisa a performance de um conteúdo de marketing e sugere otimizações com IA.
    """
    return analyze_marketing_performance_with_ai(request_data)

# --- Endpoint de Saúde (Health Check) ---

@app.get("/health")
async def health_check():
    """Verifica se o serviço está ativo."""
    return {"status": "ok", "service": "Sinergia Pro Marketing Agent 2.0 API"}

# Para rodar localmente: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
