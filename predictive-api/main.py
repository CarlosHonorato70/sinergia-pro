import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from openai import OpenAI

# Configuração do Cliente OpenAI
try:
    client = OpenAI()
except Exception as e:
    print(f"Erro ao inicializar o cliente OpenAI: {e}")
    client = None

app = FastAPI(
    title="Sinergia Pro - Serviço de Análise Preditiva",
    description="Microsserviço para análise preditiva de padrões clínicos com IA.",
    version="1.0.0"
)

# --- Modelos Pydantic ---

class PredictiveRequest(BaseModel):
    """Modelo de requisição para a análise preditiva."""
    prontuarios_historicos: List[str] = Field(..., description="Lista de resumos de prontuários de sessões anteriores.")
    diarios_paciente: List[str] = Field(..., description="Lista de entradas de diário ou check-ins do paciente.")
    escalas_recentes: List[str] = Field(..., description="Lista de resultados recentes de escalas (ex: PHQ-9, GAD-7).")

class PredictiveResponse(BaseModel):
    """Modelo de resposta com a análise preditiva gerada."""
    pattern_analysis: str = Field(..., description="Análise detalhada dos padrões de humor e comportamento identificados.")
    trigger_identification: List[str] = Field(..., description="Lista de gatilhos de crise ou recaída identificados pela IA.")
    recidivism_risk: str = Field(..., description="Nível de risco de recaída ou crise (Baixo, Moderado, Alto) e justificativa.")
    suggested_interventions: List[str] = Field(..., description="Sugestões de intervenções terapêuticas proativas para a próxima sessão.")

# --- Lógica de Geração de Análise Preditiva com IA ---

def generate_predictive_analysis_with_ai(data: PredictiveRequest) -> PredictiveResponse:
    """
    Função principal que interage com o modelo de linguagem para gerar a análise preditiva.
    """
    if not client:
        # Retorna um mock em caso de falha na inicialização do cliente
        return PredictiveResponse(
            pattern_analysis="[MOCK] Análise de Padrões: Serviço de IA indisponível. Padrões não identificados.",
            trigger_identification=["[MOCK] Gatilho de crise: Indisponível"],
            recidivism_risk="Baixo (MOCK)",
            suggested_interventions=["[MOCK] Sugestão: Verificar o humor do paciente na próxima sessão."]
        )

    # Construção do Prompt para o LLM
    history_str = "\n- " + "\n- ".join(data.prontuarios_historicos)
    diaries_str = "\n- " + "\n- ".join(data.diarios_paciente)
    scales_str = "\n- " + "\n- ".join(data.escalas_recentes)
    
    system_prompt = f"""
    Você é um sistema de Inteligência Artificial de Suporte à Decisão Clínica.
    Sua tarefa é analisar o histórico clínico do paciente (prontuários, diários e escalas) e gerar uma análise preditiva de padrões de comportamento, gatilhos de crise e risco de recaída.
    
    O output deve ser um objeto JSON que contenha exatamente os campos: 'pattern_analysis', 'trigger_identification' (lista de strings), 'recidivism_risk' (string) e 'suggested_interventions' (lista de strings).
    
    Instruções:
    1. 'pattern_analysis': Identifique e descreva padrões de humor, comportamento ou eventos que se repetem.
    2. 'trigger_identification': Liste 2 a 4 gatilhos de crise ou recaída (ex: estresse no trabalho, falta de sono, conflitos familiares).
    3. 'recidivism_risk': Classifique o risco como 'Baixo', 'Moderado' ou 'Alto' e forneça uma breve justificativa.
    4. 'suggested_interventions': Sugira 2 a 3 intervenções proativas para a próxima sessão, baseadas na análise preditiva.
    """

    user_prompt = f"""
    --- Dados Históricos do Paciente ---
    Prontuários Históricos: {history_str}
    
    Diários/Check-ins do Paciente: {diaries_str}
    
    Resultados de Escalas Recentes: {scales_str}
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
        
        # O modelo deve retornar um JSON que se encaixe no PredictiveResponse
        import json
        ai_output = json.loads(response.choices[0].message.content)
        
        # Validação e retorno do modelo Pydantic
        return PredictiveResponse(**ai_output)

    except Exception as e:
        print(f"Erro na chamada da API de IA: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao gerar análise preditiva com IA: {e}")

# --- Endpoint da API ---

@app.post("/api/v1/predictive/analyze", response_model=PredictiveResponse)
async def analyze_predictive(request_data: PredictiveRequest):
    """
    Gera uma análise preditiva de padrões clínicos utilizando Inteligência Artificial.
    """
    return generate_predictive_analysis_with_ai(request_data)

# --- Endpoint de Saúde (Health Check) ---

@app.get("/health")
async def health_check():
    """Verifica se o serviço está ativo."""
    return {"status": "ok", "service": "Sinergia Pro Análise Preditiva API"}

# Para rodar localmente: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
