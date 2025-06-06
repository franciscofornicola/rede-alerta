from pydantic import BaseModel
from typing import List, Optional

# Exemplo de modelo para um Alerta
class Alerta(BaseModel):
    id: Optional[int] = None # Opcional para criação (BD gera ID)
    tipo: str
    descricao: str
    latitude: float
    longitude: float
    status: str = "Em análise" # Status padrão
    data_ocorrencia: str # Pode ser datetime, dependendo da necessidade
    # Adicione outros campos relevantes (ex: usuario_id, data_registro, etc.)

# Exemplo de modelo para um Usuário (simplificado)
class Usuario(BaseModel):
    id: Optional[int] = None
    nome: str
    email: str
    senha: str # Em uma aplicação real, a senha seria tratada com mais segurança (hashed)
    # Adicione outros campos (ex: regiao, data_cadastro, etc.)

# Exemplo de modelo para uma Região (simplificado)
class Regiao(BaseModel):
    id: Optional[int] = None
    nome: str
    # Adicione outros campos

# Exemplo de modelo para o Relato (payload de criação)
class RelatoCreate(BaseModel):
    tipo: str
    descricao: str
    latitude: float
    longitude: float
    # Pode incluir outros dados necessários para a criação do relato

# Exemplo de modelo para atualização de Status de Alerta
class AlertaUpdateStatus(BaseModel):
    status: str

# Você pode adicionar mais modelos conforme a necessidade das suas rotas 