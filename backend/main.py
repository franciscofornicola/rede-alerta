from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, status
from typing import List, Optional
from models import Base, Alerta as AlertaModel, RelatoCreate, AlertaUpdateStatus, Usuario as UsuarioModel, Regiao as RegiaoModel, Usuario as UsuarioSchema, Regiao as RegiaoSchema, UsuarioCreate, RegiaoCreate # Importar modelos Pydantic
import models # Importar modelos SQLAlchemy (tabelas)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session # Importar Session
from database import SessionLocal, engine, get_db # Importar get_db e outros de database
from sqlalchemy import text, select # Importar text e select
from datetime import datetime

app = FastAPI(title="Rede Alerta API")

# Adicionar middleware CORS - Remover se não for mais necessário com o deploy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"], # Permitir todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Permitir todos os cabeçalhos
)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API da Rede Alerta"}

# Rotas CRUD para Alertas

# Rota para criar um novo Alerta (usando o modelo RelatoCreate como payload)
@app.post("/alertas/", response_model=models.AlertaSchema)
def create_alerta(alerta: models.AlertaCreate, db: Session = Depends(get_db)):
    db_alerta = models.Alerta(
        tipo=alerta.tipo,
        descricao=alerta.descricao,
        latitude=alerta.latitude,
        longitude=alerta.longitude,
        data_ocorrencia=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_alerta)
    db.commit()
    db.refresh(db_alerta)
    return db_alerta

# Rota para listar todos os Alertas
@app.get("/alertas/", response_model=List[models.AlertaSchema])
def read_alertas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = select(models.Alerta).offset(skip).limit(limit)
    result = db.execute(query)
    alertas = result.scalars().all()
    return alertas

# Rota para obter um Alerta específico por ID
@app.get("/alertas/{alerta_id}", response_model=models.AlertaSchema)
def read_alerta(alerta_id: int, db: Session = Depends(get_db)):
    query = select(models.Alerta).where(models.Alerta.id == alerta_id)
    result = db.execute(query)
    alerta = result.scalar_one_or_none()
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    return alerta

# Rota para atualizar o status de um Alerta
@app.put("/alertas/{alerta_id}/status", response_model=models.AlertaSchema)
def update_alerta_status(alerta_id: int, status_update: models.AlertaUpdateStatus, db: Session = Depends(get_db)):
    query = select(models.Alerta).where(models.Alerta.id == alerta_id)
    result = db.execute(query)
    alerta = result.scalar_one_or_none()
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    
    alerta.status = status_update.status
    db.commit()
    db.refresh(alerta)
    return alerta

# Rota para deletar um Alerta
@app.delete("/alertas/{alerta_id}")
def delete_alerta(
    alerta_id: int,
    db: Session = Depends(get_db) # Injetar dependência
):
    alerta = db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first() # Consultar por ID
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    
    db.delete(alerta) # Deletar o objeto
    db.commit() # Commitar a transação
    return {"message": f"Alerta com ID {alerta_id} deletado"}

# Rotas CRUD para Usuários

@app.post("/usuarios/", response_model=models.UsuarioSchema)
def create_usuario(usuario: models.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hashed=usuario.senha  # Em produção, deve-se usar hash da senha
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.get("/usuarios/", response_model=List[models.UsuarioSchema])
def read_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = select(models.Usuario).offset(skip).limit(limit)
    result = db.execute(query)
    usuarios = result.scalars().all()
    return usuarios

@app.get("/usuarios/{usuario_id}", response_model=models.UsuarioSchema)
def read_usuario(usuario_id: int, db: Session = Depends(get_db)):
    query = select(models.Usuario).where(models.Usuario.id == usuario_id)
    result = db.execute(query)
    usuario = result.scalar_one_or_none()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@app.put("/usuarios/{usuario_id}", response_model=models.UsuarioSchema)
def update_usuario(
    usuario_id: int,
    usuario_update: models.UsuarioCreate, # Usar modelo Create para entrada (inclui senha)
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Atualizar campos - !!! LEMBRE-SE DE FAZER HASH DA SENHA SE ELA FOR ATUALIZADA !!!
    usuario.nome = usuario_update.nome
    usuario.email = usuario_update.email
    usuario.senha_hashed = usuario_update.senha # !!! LEMBRE-SE DE FAZER HASH !!!

    db.commit() # Commitar a transação
    db.refresh(usuario) # Atualizar o objeto
    return usuario

@app.delete("/usuarios/{usuario_id}")
def delete_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db.delete(usuario)
    db.commit()
    return {"message": f"Usuário com ID {usuario_id} deletado"}

# Rotas CRUD para Regiões

@app.post("/regioes/", response_model=models.RegiaoSchema)
def create_regiao(regiao: models.RegiaoCreate, db: Session = Depends(get_db)):
    db_regiao = models.Regiao(nome=regiao.nome)
    db.add(db_regiao)
    db.commit()
    db.refresh(db_regiao)
    return db_regiao

@app.get("/regioes/", response_model=List[models.RegiaoSchema])
def read_regioes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = select(models.Regiao).offset(skip).limit(limit)
    result = db.execute(query)
    regioes = result.scalars().all()
    return regioes

@app.get("/regioes/{regiao_id}", response_model=models.RegiaoSchema)
def read_regiao(regiao_id: int, db: Session = Depends(get_db)):
    query = select(models.Regiao).where(models.Regiao.id == regiao_id)
    result = db.execute(query)
    regiao = result.scalar_one_or_none()
    if regiao is None:
        raise HTTPException(status_code=404, detail="Região não encontrada")
    return regiao

@app.put("/regioes/{regiao_id}", response_model=models.RegiaoSchema)
def update_regiao(
    regiao_id: int,
    regiao_update: models.RegiaoCreate, # Usar modelo Create para entrada
    db: Session = Depends(get_db)
):
    regiao = db.query(models.Regiao).filter(models.Regiao.id == regiao_id).first()
    if regiao is None:
        raise HTTPException(status_code=404, detail="Região não encontrada")
    
    # Atualizar campos
    regiao.nome = regiao_update.nome

    db.commit() # Commitar a transação
    db.refresh(regiao) # Atualizar o objeto
    return regiao

@app.delete("/regioes/{regiao_id}")
def delete_regiao(
    regiao_id: int,
    db: Session = Depends(get_db)
):
    regiao = db.query(models.Regiao).filter(models.Regiao.id == regiao_id).first()
    if regiao is None:
        raise HTTPException(status_code=404, detail="Região não encontrada")
    
    db.delete(regiao)
    db.commit()
    return {"message": f"Região com ID {regiao_id} deletada"}


