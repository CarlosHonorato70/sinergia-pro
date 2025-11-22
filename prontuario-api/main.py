import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from openai import OpenAI

# Configuração do Cliente OpenAI
# O cliente usará automaticamente a variável de ambiente OPENAI_API_KEY
try:
    client = OpenAI()
except Exception as e:
    print(f"Erro ao inicializar o cliente OpenAI: {e}")
    client = None

app = FastAPI(
    title="Sinergia Pro - Serviço de Prontuário 2.0",
    description="Microsserviço para geração avançada de prontuários clínicos com IA.",
    version="1.0.0"
)

# --- Modelos Pydantic (Baseados na Especificação) ---

class ProntuarioRequest(BaseModel):
    """Modelo de requisição para a geração do prontuário."""
    session_notes: str = Field(..., description="Anotações detalhadas do psicólogo sobre a sessão atual.")
    patient_history: str = Field(..., description="Resumo do histórico clínico e prontuários anteriores do paciente.")
    therapeutic_goals: List[str] = Field(..., description="Lista dos objetivos terapêuticos atuais do paciente.")
    model_theory: str = Field(..., description="O modelo teórico do psicólogo (ex: TCC, Psicanálise).")

class ProntuarioResponse(BaseModel):
    """Modelo de resposta com o prontuário gerado."""
    session_summary: str = Field(..., description="Resumo conciso e profissional da sessão atual.")
    progress_analysis: str = Field(..., description="Análise do progresso do paciente em relação aos objetivos de longo prazo.")
    suggested_objectives: List[str] = Field(..., description="Sugestões de objetivos para a próxima sessão ou ciclo terapêutico.")
    prontuario_completo: str = Field(..., description="O texto final formatado do Prontuário 2.0, pronto para ser salvo.")

# --- Lógica de Geração de Prontuário com IA ---

def generate_prontuario_with_ai(data: ProntuarioRequest) -> ProntuarioResponse:
    """
    Função principal que interage com o modelo de linguagem para gerar o prontuário.
    """
    if not client:
        # Retorna um mock em caso de falha na inicialização do cliente
        return ProntuarioResponse(
            session_summary="[MOCK] Resumo da sessão gerado sem IA devido a erro de conexão.",
            progress_analysis="[MOCK] Análise de progresso: Manter foco nos objetivos.",
            suggested_objectives=["[MOCK] Agendar próxima sessão"],
            prontuario_completo="[MOCK] Prontuário completo: Serviço de IA indisponível."
        )

    # Construção do Prompt para o LLM
    goals_str = "\n- " + "\n- ".join(data.therapeutic_goals)
    
    system_prompt = f"""
    Você é um assistente clínico de Inteligência Artificial especializado em gerar prontuários clínicos para psicólogos.
    Sua tarefa é analisar as anotações da sessão e o histórico do paciente, e gerar um Prontuário 2.0 completo e profissional.
    O prontuário deve ser baseado no modelo teórico: {data.model_theory}.
    
    O output deve ser um objeto JSON que contenha exatamente os campos: 'session_summary', 'progress_analysis', 'suggested_objectives' (lista de strings) e 'prontuario_completo'.
    
    Instruções:
    1. 'session_summary': Crie um resumo conciso e objetivo da sessão.
    2. 'progress_analysis': Analise o progresso do paciente em relação aos objetivos de longo prazo.
    3. 'suggested_objectives': Sugira 2 a 3 objetivos específicos e acionáveis para a próxima sessão ou ciclo terapêutico.
    4. 'prontuario_completo': Combine o resumo e a análise em um texto único e formatado profissionalmente.
    """

    user_prompt = f"""
    --- Dados da Sessão ---
    Anotações da Sessão Atual: "{data.session_notes}"
    
    --- Histórico e Contexto ---
    Histórico Clínico do Paciente: "{data.patient_history}"
    Objetivos Terapêuticos Atuais: {goals_str}
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
        
        # O modelo deve retornar um JSON que se encaixe no ProntuarioResponse
        import json
        ai_output = json.loads(response.choices[0].message.content)
        
        # Validação e retorno do modelo Pydantic
        return ProntuarioResponse(**ai_output)

    except Exception as e:
        print(f"Erro na chamada da API de IA: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao gerar prontuário com IA: {e}")

# --- Endpoint da API ---

@app.post("/api/v1/prontuario/generate", response_model=ProntuarioResponse)
async def generate_prontuario(request_data: ProntuarioRequest):
    """
    Gera um Prontuário 2.0 avançado utilizando Inteligência Artificial.
    """
    return generate_prontuario_with_ai(request_data)

# --- Endpoint de Saúde (Health Check) ---

@app.get("/health")
async def health_check():
    """Verifica se o serviço está ativo."""
    return {"status": "ok", "service": "Sinergia Pro Prontuário 2.0 API"}

# Para rodar localmente: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
