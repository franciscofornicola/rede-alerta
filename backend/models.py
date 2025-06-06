from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime

# Definir a base declarativa
Base = declarative_base()

# Definir o modelo SQLAlchemy (Tabela) para Alerta
class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    tipo = Column(String(255))
    descricao = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String(50), default="Em análise")
    data_ocorrencia = Column(TIMESTAMP)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

# Definir o modelo SQLAlchemy (Tabela) para Conquista
class Conquista(Base):
    __tablename__ = "conquistas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    descricao = Column(String(500))
    icone = Column(String(50))
    cor = Column(String(20))
    pontos_necessarios = Column(Integer)

# Definir o modelo SQLAlchemy (Tabela) para UsuarioConquista
class UsuarioConquista(Base):
    __tablename__ = "usuario_conquistas"

    usuario_id = Column(Integer, ForeignKey('usuarios.id'), primary_key=True)
    conquista_id = Column(Integer, ForeignKey('conquistas.id'), primary_key=True)
    data_conquista = Column(TIMESTAMP, default=datetime.now)

    # Relacionamentos
    usuario = relationship("Usuario", back_populates="conquistas")
    conquista = relationship("Conquista")

# Definir o modelo SQLAlchemy (Tabela) para Usuário
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    senha_hashed = Column(String(100))
    nivel = Column(Integer, default=1)
    pontos = Column(Integer, default=0)

    # Relacionamento com conquistas
    conquistas = relationship("UsuarioConquista", back_populates="usuario")

# Definir o modelo SQLAlchemy (Tabela) para Região
class Regiao(Base):
    __tablename__ = "regioes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), unique=True, index=True)

# --- Modelos Pydantic (Schemas) --- #

class ConquistaBase(BaseModel):
    nome: str
    descricao: str
    icone: str
    cor: str
    pontos_necessarios: int

class ConquistaCreate(ConquistaBase):
    pass

class ConquistaSchema(ConquistaBase):
    id: int

    class Config:
        from_attributes = True

class UsuarioConquistaBase(BaseModel):
    usuario_id: int
    conquista_id: int
    data_conquista: datetime

class UsuarioConquistaCreate(UsuarioConquistaBase):
    pass

class UsuarioConquistaSchema(UsuarioConquistaBase):
    class Config:
        from_attributes = True

class AlertaBase(BaseModel):
    tipo: str
    descricao: str
    latitude: float
    longitude: float

class AlertaCreate(AlertaBase):
    pass

class AlertaSchema(AlertaBase):
    id: int
    status: str
    data_ocorrencia: str

    class Config:
        from_attributes = True

class UsuarioBase(BaseModel):
    nome: str
    email: str
    nivel: int = 1
    pontos: int = 0

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioSchema(UsuarioBase):
    id: int
    conquistas: List[ConquistaSchema] = []

    class Config:
        from_attributes = True

class RegiaoBase(BaseModel):
    nome: str

class RegiaoCreate(RegiaoBase):
    pass

class RegiaoSchema(RegiaoBase):
    id: int

    class Config:
        from_attributes = True

class AlertaUpdateStatus(BaseModel):
    status: str

class RelatoCreate(BaseModel):
    titulo: str
    tipo: str
    descricao: str
    latitude: float
    longitude: float 