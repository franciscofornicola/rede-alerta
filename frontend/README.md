# Rede Alerta

Um aplicativo React Native para ajudar a manter a comunidade mais segura através de relatos e alertas.

## Funcionalidades

- Relato de situações suspeitas ou problemas
- Visualização de alertas em mapa
- Dicas de segurança
- Painel geral com histórico de alertas
- Interface intuitiva e amigável

## Requisitos

- Node.js (versão 14 ou superior)
- Python 3.8 ou superior
- npm ou yarn
- Expo CLI
- Expo Go (para iOS/Android)

## Instalação

### Backend (FastAPI)

1. Navegue até o diretório do backend:
```bash
cd backend
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac
```

3. Instale as dependências:
```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv
```

4. Inicie o servidor:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend (React Native)

1. Navegue até o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o aplicativo:
```bash
npx expo start
```

4. Use o Expo Go no seu dispositivo móvel para escanear o QR code.

## Estrutura do Projeto

```
rede-alerta/
├── backend/
│   ├── main.py          # Aplicação FastAPI
│   ├── database.py      # Configuração do banco de dados
│   ├── models.py        # Modelos de dados
│   └── create_tables.sql # Script SQL para criar tabelas
│
└── frontend/
    ├── assets/          # Imagens e recursos
    ├── components/      # Componentes reutilizáveis
    ├── screens/         # Telas do aplicativo
    ├── styles/          # Estilos globais
    ├── App.js          # Componente principal
    └── package.json    # Dependências
```

## Tecnologias Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- Python-Jose (JWT)
- Passlib (Hash de senhas)
- Uvicorn

### Frontend
- React Native
- Expo
- React Navigation
- Expo Image Picker
- Material Icons

## Como Usar

1. Inicie o backend primeiro (porta 8000)
2. Inicie o frontend com Expo
3. Escaneie o QR code com o Expo Go no seu dispositivo
4. O aplicativo estará pronto para uso!

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 