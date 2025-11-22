# Sinergia Pro: Frontend Web do Terapeuta (React)

Este projeto contém o código-fonte para o **Frontend Web do Terapeuta** do **Sinergia Pro**, desenvolvido em **React**. Ele serve como a interface principal para o psicólogo, focando na visualização de dados do paciente e na integração com os microsserviços de backend.

## 1. Funcionalidades Implementadas

*   **Dashboard do Paciente:** Exibe informações básicas do paciente.
*   **Visualizador de Diário Terapêutico:**
    *   Gráfico de linha da evolução do Nível de Humor.
    *   Lista de entradas do Diário Terapêutico Interativo (dados mock).
    *   Botão para simular a **Análise Preditiva** (chamada ao microsserviço).
*   **Módulo de Teleterapia:**
    *   Exibe a próxima sessão agendada.
    *   Botão para simular a **Criação de Sala de Reunião** (chamada ao microsserviço).

## 2. Pré-requisitos

*   Node.js (versão LTS recomendada).
*   npm ou yarn.

## 3. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_therapist_web
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    ```

## 4. Execução do Aplicativo

Inicie o servidor de desenvolvimento do React:

```bash
npm start
# ou
# yarn start
```

O aplicativo estará acessível em `http://localhost:3000` (ou outra porta disponível).

## 5. Estrutura do Projeto

```
sintropia_therapist_web/
├── public/
│   └── index.html      # Arquivo HTML principal
├── src/
│   ├── App.js          # Componente principal
│   ├── App.css         # Estilos globais
│   ├── components/
│   │   ├── PatientDashboard.js # Dashboard principal do paciente
│   │   ├── DiaryViewer.js      # Visualizador de entradas do Diário Terapêutico (com gráfico)
│   │   └── TeletherapyCard.js  # Cartão de agendamento e link para Teleterapia
│   └── index.js        # Ponto de entrada do React
├── package.json        # Dependências do React
└── README.md           # Este arquivo
```

## 6. Próximos Passos (Desenvolvimento)

Para tornar o frontend totalmente funcional, seria necessário:
1.  Implementar a lógica de autenticação e roteamento (login, seleção de paciente).
2.  Substituir os dados mock por chamadas reais aos microsserviços de backend (Prontuário 2.0, Análise Preditiva, Teleterapia e um futuro serviço de dados).
3.  Adicionar o módulo de Geração de Prontuário 2.0.
4.  Refinar o design e a usabilidade.
