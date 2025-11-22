# Sinergia Pro: Aplicativo Mobile do Paciente (React Native)

Este projeto contém o código-fonte para o **Aplicativo Mobile do Paciente** do **Sinergia Pro**, desenvolvido em **React Native** (com estrutura Expo). O foco inicial é no **Diário Terapêutico Interativo**, uma ferramenta crucial para o engajamento contínuo e para alimentar o microsserviço de Análise Preditiva.

## 1. Funcionalidade Principal

O aplicativo permite que o paciente registre entradas diárias com os seguintes dados:
*   Nível de Humor (escala de 1 a 10).
*   Seleção de Emoções (máximo de 3).
*   Descrição do Evento/Situação.
*   Registro de Pensamentos Automáticos.
*   Descrição do Comportamento/Ações.

Ao salvar, a entrada é simuladamente enviada para o backend para ser utilizada na análise do terapeuta.

## 2. Pré-requisitos

*   Node.js (versão LTS recomendada).
*   npm ou yarn.
*   Expo CLI (`npm install -g expo-cli`).
*   Um emulador de celular (Android Studio ou Xcode) ou o aplicativo Expo Go no seu celular.

## 3. Configuração e Instalação

1.  **Navegue para o diretório do projeto:**
    ```bash
    cd sintropia_patient_app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    ```

## 4. Execução do Aplicativo

Inicie o servidor de desenvolvimento do Expo:

```bash
expo start
```

Após a execução, o terminal exibirá um QR Code. Você pode:
*   **Escanear o QR Code** com o aplicativo **Expo Go** no seu celular (iOS ou Android).
*   Pressionar `a` para abrir no emulador Android.
*   Pressionar `i` para abrir no simulador iOS (somente macOS).

## 5. Estrutura do Projeto

```
sintropia_patient_app/
├── App.js              # Componente principal com a interface do Diário Terapêutico
├── package.json        # Dependências do React Native
└── README.md           # Este arquivo
```

## 6. Próximos Passos (Desenvolvimento)

Para tornar o aplicativo funcional, seria necessário:
1.  Implementar a lógica de comunicação real com o backend (microsserviço de dados que armazena as entradas do diário).
2.  Adicionar telas de login/autenticação.
3.  Integrar a funcionalidade de Teleterapia (link direto para a sala de reunião).
4.  Adicionar a funcionalidade de Planos de Ação Adaptativos.
