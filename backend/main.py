from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends # Importar Depends
from typing import List, Optional
from models import Base, Alerta as AlertaModel, RelatoCreate, AlertaUpdateStatus, Usuario as UsuarioModel, Regiao as RegiaoModel, Usuario as UsuarioSchema, Regiao as RegiaoSchema, UsuarioCreate, RegiaoCreate # Importar modelos Pydantic
import models # Importar modelos SQLAlchemy (tabelas)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session # Importar Session
from database import SessionLocal, engine, get_db # Importar get_db e outros de database
from sqlalchemy import text, select # Importar text e select

app = FastAPI()

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
@app.post("/alertas/", response_model=AlertaModel)
def create_alerta(
    relato: RelatoCreate,
    db: Session = Depends(get_db) # Injetar dependência do banco de dados
):
    # Criar uma instância do modelo SQLAlchemy Alerta
    db_alerta = AlertaModel(
        tipo=relato.tipo,
        descricao=relato.descricao,
        latitude=relato.latitude,
        longitude=relato.longitude,
        # status e data_ocorrencia terão valores padrão ou serão gerados pelo BD/backend
        # Você pode adicionar lógica para definir status inicial e data/hora aqui
    )
    db.add(db_alerta) # Adicionar o objeto ao staged da sessão
    db.commit() # Commitar a transação (salvar no BD)
    db.refresh(db_alerta) # Atualizar o objeto com o ID gerado pelo BD
    return db_alerta # Retorna o objeto recém-criado com o ID

# Rota para listar todos os Alertas
@app.get("/alertas/", response_model=List[AlertaModel])
def read_alertas(db: Session = Depends(get_db)): # Injetar dependência
    # Consultar todos os Alertas no BD usando select
    alertas = db.query(AlertaModel).all()
    return alertas

# Rota para obter um Alerta específico por ID
@app.get("/alertas/{alerta_id}", response_model=AlertaModel)
def read_alerta(
    alerta_id: int,
    db: Session = Depends(get_db) # Injetar dependência
):
    # Consultar por ID usando select e where
    alerta = db.query(AlertaModel).filter(AlertaModel.id == alerta_id).first()
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    return alerta

# Rota para atualizar o status de um Alerta
@app.put("/alertas/{alerta_id}/status", response_model=AlertaModel)
def update_alerta_status(
    alerta_id: int,
    status_update: AlertaUpdateStatus,
    db: Session = Depends(get_db) # Injetar dependência
):
    alerta = db.query(AlertaModel).filter(AlertaModel.id == alerta_id).first() # Consultar por ID
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    
    alerta.status = status_update.status # Atualizar o campo
    db.commit() # Commitar a transação
    db.refresh(alerta) # Atualizar o objeto
    return alerta

# Rota para deletar um Alerta
@app.delete("/alertas/{alerta_id}")
def delete_alerta(
    alerta_id: int,
    db: Session = Depends(get_db) # Injetar dependência
):
    alerta = db.query(AlertaModel).filter(AlertaModel.id == alerta_id).first() # Consultar por ID
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    
    db.delete(alerta) # Deletar o objeto
    db.commit() # Commitar a transação
    return {"message": f"Alerta com ID {alerta_id} deletado"}

# Rotas CRUD para Usuários

@app.post("/usuarios/", response_model=UsuarioSchema)
def create_usuario(
    usuario: UsuarioCreate, # Usar modelo Create para entrada
    db: Session = Depends(get_db)
):
    # Criar uma instância do modelo SQLAlchemy Usuario
    # Em uma aplicação real, você faria hash da senha aqui!
    db_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hashed=usuario.senha # !!! LEMBRE-SE DE FAZER HASH DA SENHA EM PRODUÇÃO !!!
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario # Retorna o objeto recém-criado com o ID

@app.get("/usuarios/", response_model=List[UsuarioSchema])
def read_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    return usuarios

@app.get("/usuarios/{usuario_id}", response_model=UsuarioSchema)
def read_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@app.put("/usuarios/{usuario_id}", response_model=UsuarioSchema)
def update_usuario(
    usuario_id: int,
    usuario_update: UsuarioCreate, # Usar modelo Create para entrada (inclui senha)
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

@app.post("/regioes/", response_model=RegiaoSchema)
def create_regiao(
    regiao: RegiaoCreate, # Usar modelo Create para entrada
    db: Session = Depends(get_db)
):
    # Criar uma instância do modelo SQLAlchemy Regiao
    db_regiao = models.Regiao(
        nome=regiao.nome
    )
    db.add(db_regiao)
    db.commit()
    db.refresh(db_regiao)
    return db_regiao # Retorna o objeto recém-criado com o ID

@app.get("/regioes/", response_model=List[RegiaoSchema])
def read_regioes(db: Session = Depends(get_db)):
    regioes = db.query(models.Regiao).all()
    return regioes

@app.get("/regioes/{regiao_id}", response_model=RegiaoSchema)
def read_regiao(
    regiao_id: int,
    db: Session = Depends(get_db)
):
    regiao = db.query(models.Regiao).filter(models.Regiao.id == regiao_id).first()
    if regiao is None:
        raise HTTPException(status_code=404, detail="Região não encontrada")
    return regiao

@app.put("/regioes/{regiao_id}", response_model=RegiaoSchema)
def update_regiao(
    regiao_id: int,
    regiao_update: RegiaoCreate, # Usar modelo Create para entrada
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

def startup_event():
    import models # Importar modelos SQLAlchemy (tabelas) - MOVIDO PARA DENTRO DA FUNÇÃO
    try:
        # Cria todas as tabelas definidas em models.py
        models.Base.metadata.create_all(bind=engine)
        print("INFO: Tabelas do banco de dados verificadas/criadas com sucesso.")
    except Exception as e:
        print(f"ERROR: Erro ao criar tabelas do banco de dados: {e}")
        # Em produção, você pode querer sair ou logar severamente

app.add_event_handler("startup", startup_event)


