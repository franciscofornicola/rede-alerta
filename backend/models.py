from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float # Importar tipos de colunas
from sqlalchemy.ext.declarative import declarative_base # Importar declarative_base
from sqlalchemy.sql.sqltypes import DateTime

# Definir a base declarativa
Base = declarative_base()

# Definir o modelo SQLAlchemy (Tabela) para Alerta
class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(255))
    descricao = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String(255), default="Em análise")
    data_ocorrencia = Column(String(255))

    # Adicione outros campos relevantes (ex: usuario_id, data_registro, etc.)

# Definir o modelo SQLAlchemy (Tabela) para Usuário
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    senha_hashed = Column(String) # Armazenar senha hashed, não a senha pura
    # Adicione outros campos (ex: regiao_id, data_cadastro, etc.)

# Definir o modelo SQLAlchemy (Tabela) para Região
class Regiao(Base):
    __tablename__ = "regioes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, index=True)
    # Adicione outros campos

# --- Modelos Pydantic (Schemas) --- #
# Usados para validação de dados de entrada e saída das APIs

class AlertaBase(BaseModel):
    tipo: str
    descricao: str
    latitude: float
    longitude: float

class AlertaCreate(AlertaBase): # Modelo para criar Alerta (não precisa de ID)
    pass

class Alerta(AlertaBase):
    id: int
    status: str
    data_ocorrencia: str # Manter como string por consistência com o modelo SQLAlchemy

    class Config:
        from_attributes = True # Era orm_mode = True em Pydantic v1


class UsuarioBase(BaseModel):
    nome: str
    email: str

class UsuarioCreate(UsuarioBase):
    senha: str # Senha é necessária na criação

class Usuario(UsuarioBase):
    id: int
    # Não incluir senha_hashed no modelo de retorno da API

    class Config:
        from_attributes = True # Era orm_mode = True em Pydantic v1


class RegiaoBase(BaseModel):
    nome: str

class RegiaoCreate(RegiaoBase):
    pass

class Regiao(RegiaoBase):
    id: int

    class Config:
        from_attributes = True # Era orm_mode = True em Pydantic v1


class AlertaUpdateStatus(BaseModel):
    status: str


# Modelos Pydantic que já existiam (movidos para baixo e renomeados/ajustados)
# class Alerta(BaseModel):
# ... (outras definições Pydantic originais movidas/adaptadas acima)

# Exemplo de modelo para o Relato (payload de criação)
class RelatoCreate(BaseModel):
    tipo: str
    descricao: str
    latitude: float
    longitude: float
    # Pode incluir outros dados necessários para a criação do relato 