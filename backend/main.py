from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, status
from typing import List, Optional
from models import Base, Alerta, RelatoCreate, AlertaUpdateStatus, Usuario, Regiao, UsuarioCreate, RegiaoCreate, Conquista, UsuarioConquista # Importar modelos e tabelas necessários
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

# Lista em memória para armazenar alertas temporariamente
alertas = []

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API da Rede Alerta"}

# Rotas CRUD para Alertas

# Rota para criar um novo Alerta (usando o modelo RelatoCreate como payload)
@app.post("/alertas/", response_model=models.AlertaSchema)
def create_alerta(alerta: models.RelatoCreate, db: Session = Depends(get_db)):
    print("@@@ Received /alertas/ POST request @@@")
    
    try:
        # Criar uma instância do modelo AlertaModel com os dados do payload
        db_alerta = models.Alerta(
            titulo=alerta.titulo,
            tipo=alerta.tipo,
            descricao=alerta.descricao,
            latitude=alerta.latitude,
            longitude=alerta.longitude,
            status='Em análise', # Definir status inicial
            data_ocorrencia=datetime.now(), # Usar datetime.now()
            usuario_id=1 # Usar o ID do usuário padrão (1) por enquanto
        )

        # Adicionar o objeto ao banco de dados e commitar
        db.add(db_alerta)
        db.commit()
        db.refresh(db_alerta) # Atualizar o objeto para ter o ID gerado

        # O ID gerado estará agora em db_alerta.id
        print(f"@@@ Alerta inserido com ID: {db_alerta.id} @@@") # Log de debug

        created_alerta = db_alerta # Usar o objeto que acabamos de criar e atualizar

        if created_alerta is None:
            raise HTTPException(status_code=500, detail="Falha ao criar ou recuperar o alerta recém-criado.") # Mensagem ligeiramente ajustada

        # Adicionar pontos ao usuário (exemplo: 10 pontos por alerta)
        # TODO: Adicionar usuario_id ao alerta e usar o ID correto
        # Por enquanto, vamos usar o usuário com ID 1 como exemplo
        usuario_id = 1
        usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
        if usuario:
            usuario.pontos += 10
            usuario.nivel = (usuario.pontos // 100) + 1
            db.commit()
            
            # Verificar conquistas
            verificar_conquistas(usuario_id, db)

        response_alerta = models.AlertaSchema(
            id=created_alerta.id,
            tipo=created_alerta.tipo,
            descricao=created_alerta.descricao,
            latitude=created_alerta.latitude,
            longitude=created_alerta.longitude,
            status=created_alerta.status,
            data_ocorrencia=created_alerta.data_ocorrencia.strftime("%Y-%m-%d %H:%M:%S")
        )

        return response_alerta

    except Exception as e:
        db.rollback()
        print(f"Erro ao criar alerta no banco de dados: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao criar alerta: {e}")

# Rota para listar todos os Alertas
@app.get("/alertas/", response_model=List[models.AlertaSchema])
def read_alertas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Consultar alertas do banco de dados
    alertas_db = db.query(models.Alerta).offset(skip).limit(limit).all()
    
    # Formatar data_ocorrencia para string na resposta para corresponder ao schema
    alertas_formatados = []
    for alerta in alertas_db:
        # Use orm_mode=True style attribute access
        alerta_dict = {
            "id": alerta.id,
            "tipo": alerta.tipo,
            "descricao": alerta.descricao,
            "latitude": alerta.latitude,
            "longitude": alerta.longitude,
            "status": alerta.status,
            "data_ocorrencia": alerta.data_ocorrencia.strftime("%Y-%m-%d %H:%M:%S") # Formatar datetime para string
        }
        alertas_formatados.append(alerta_dict)

    return alertas_formatados # Retornar lista de dicionários formatados

# Rota para obter um Alerta específico por ID
@app.get("/alertas/{alerta_id}", response_model=models.AlertaSchema)
def read_alerta(alerta_id: int, db: Session = Depends(get_db)):
    alerta = db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first()
    if alerta is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    
    # Formatar data_ocorrencia para string na resposta
    alerta_dict = {
        "id": alerta.id,
        "tipo": alerta.tipo,
        "descricao": alerta.descricao,
        "latitude": alerta.latitude,
        "longitude": alerta.longitude,
        "status": alerta.status,
        "data_ocorrencia": alerta.data_ocorrencia.strftime("%Y-%m-%d %H:%M:%S")
    }
    return models.AlertaSchema(**alerta_dict) # Retornar schema formatado

# Rota para atualizar o status de um Alerta
@app.put("/alertas/{alerta_id}/status", response_model=models.AlertaSchema)
def update_alerta_status(alerta_id: int, status_update: models.AlertaUpdateStatus, db: Session = Depends(get_db)):
    print(f"@@@ Received PUT request to update status for alerta {alerta_id} to {status_update.status} @@@")
    
    try:
        alerta = db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first()
        if alerta is None:
            raise HTTPException(status_code=404, detail="Alerta não encontrado")
        
        alerta.status = status_update.status
        db.commit()
        db.refresh(alerta)
        
        # Formatar data_ocorrencia para string na resposta
        alerta_dict = {
            "id": alerta.id,
            "tipo": alerta.tipo,
            "descricao": alerta.descricao,
            "latitude": alerta.latitude,
            "longitude": alerta.longitude,
            "status": alerta.status,
            "data_ocorrencia": alerta.data_ocorrencia.strftime("%Y-%m-%d %H:%M:%S")
        }
        print(f"@@@ Successfully updated alerta {alerta_id} status to {alerta.status} @@@")
        return models.AlertaSchema(**alerta_dict)
    except Exception as e:
        print(f"@@@ Error updating alerta status: {str(e)} @@@")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar status do alerta: {str(e)}")

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

# Rotas para o sistema de gamificação

@app.get("/usuarios/{usuario_id}/perfil", response_model=models.UsuarioSchema)
def get_usuario_perfil(usuario_id: int, db: Session = Depends(get_db)):
    print(f"@@@ Acessando rota de perfil para usuario_id: {usuario_id} @@@") # Log de debug
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Formatar o objeto usuario do SQLAlchemy para o Pydantic UsuarioSchema
    # Precisamos garantir que a lista de conquistas contenha objetos ConquistaSchema
    conquistas_schema = []
    for uc in usuario.conquistas:
        # uc é um objeto UsuarioConquista, precisamos do objeto Conquista associado
        conquista = db.query(models.Conquista).filter(models.Conquista.id == uc.conquista_id).first()
        if conquista:
            conquistas_schema.append(models.ConquistaSchema(**conquista.__dict__))

    usuario_schema = models.UsuarioSchema(
        id=usuario.id,
        nome=usuario.nome,
        email=usuario.email,
        nivel=usuario.nivel,
        pontos=usuario.pontos,
        conquistas=conquistas_schema
    )

    return usuario_schema # Retorna o objeto Pydantic formatado

@app.post("/usuarios/{usuario_id}/pontos", response_model=models.UsuarioSchema)
def adicionar_pontos(usuario_id: int, pontos: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    usuario.pontos += pontos
    # Atualizar nível baseado nos pontos (exemplo: 100 pontos por nível)
    usuario.nivel = (usuario.pontos // 100) + 1
    
    db.commit()
    db.refresh(usuario)
    return usuario

@app.get("/conquistas/", response_model=List[models.ConquistaSchema])
def listar_conquistas(db: Session = Depends(get_db)):
    return db.query(models.Conquista).all()

@app.post("/usuarios/{usuario_id}/conquistas/{conquista_id}")
def atribuir_conquista(usuario_id: int, conquista_id: int, db: Session = Depends(get_db)):
    # Verificar se usuário existe
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se conquista existe
    conquista = db.query(models.Conquista).filter(models.Conquista.id == conquista_id).first()
    if conquista is None:
        raise HTTPException(status_code=404, detail="Conquista não encontrada")
    
    # Verificar se usuário já tem a conquista
    usuario_conquista = db.query(models.UsuarioConquista).filter(
        models.UsuarioConquista.usuario_id == usuario_id,
        models.UsuarioConquista.conquista_id == conquista_id
    ).first()
    
    if usuario_conquista is not None:
        raise HTTPException(status_code=400, detail="Usuário já possui esta conquista")
    
    # Atribuir conquista ao usuário
    nova_conquista = models.UsuarioConquista(
        usuario_id=usuario_id,
        conquista_id=conquista_id
    )
    db.add(nova_conquista)
    
    # Adicionar pontos da conquista
    usuario.pontos += conquista.pontos_necessarios
    usuario.nivel = (usuario.pontos // 100) + 1
    
    db.commit()
    return {"message": "Conquista atribuída com sucesso"}

# Função auxiliar para verificar e atribuir conquistas automaticamente
def verificar_conquistas(usuario_id: int, db: Session):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        return
    
    # Exemplo de regras para conquistas
    conquistas = db.query(models.Conquista).all()
    for conquista in conquistas:
        # Verificar se usuário já tem a conquista
        usuario_conquista = db.query(models.UsuarioConquista).filter(
            models.UsuarioConquista.usuario_id == usuario_id,
            models.UsuarioConquista.conquista_id == conquista.id
        ).first()
        
        if usuario_conquista is None and usuario.pontos >= conquista.pontos_necessarios:
            # Atribuir conquista
            nova_conquista = models.UsuarioConquista(
                usuario_id=usuario_id,
                conquista_id=conquista.id
            )
            db.add(nova_conquista)
    
    db.commit()


