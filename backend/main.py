from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from typing import List, Optional # Importar Optional
from models import Alerta, RelatoCreate, AlertaUpdateStatus, Usuario, Regiao # Importar novos modelos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Listas em memória para simular o banco de dados (REMOVER ao integrar com Oracle)
alertas_db = []
usuarios_db = []
regioes_db = []

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao Backend Rede Alerta!"}

# Rotas CRUD para Alertas

# Rota para criar um novo Alerta (usando o modelo RelatoCreate como payload)
@app.post("/alertas/", response_model=Alerta)
def create_alerta(relato: RelatoCreate):
    # Simula a criação de um ID e a data de ocorrência
    new_alerta = Alerta(
        id=len(alertas_db) + 1,
        tipo=relato.tipo,
        descricao=relato.descricao,
        latitude=relato.latitude,
        longitude=relato.longitude,
        data_ocorrencia="Hoje" # Placeholder, usar data/hora real depois
    )
    alertas_db.append(new_alerta)
    return new_alerta

# Rota para listar todos os Alertas
@app.get("/alertas/", response_model=List[Alerta])
def read_alertas():
    return alertas_db

# Rota para obter um Alerta específico por ID
@app.get("/alertas/{alerta_id}", response_model=Alerta)
def read_alerta(alerta_id: int):
    for alerta in alertas_db:
        if alerta.id == alerta_id:
            return alerta
    raise HTTPException(status_code=404, detail="Alerta não encontrado")

# Rota para atualizar o status de um Alerta
@app.put("/alertas/{alerta_id}/status", response_model=Alerta)
def update_alerta_status(alerta_id: int, status_update: AlertaUpdateStatus):
    for alerta in alertas_db:
        if alerta.id == alerta_id:
            alerta.status = status_update.status
            return alerta
    raise HTTPException(status_code=404, detail="Alerta não encontrado")

# Rota para deletar um Alerta
@app.delete("/alertas/{alerta_id}")
def delete_alerta(alerta_id: int):
    global alertas_db
    initial_len = len(alertas_db)
    alertas_db = [alerta for alerta in alertas_db if alerta.id != alerta_id]
    if len(alertas_db) < initial_len:
        return {"message": f"Alerta com ID {alerta_id} deletado"}
    raise HTTPException(status_code=404, detail="Alerta não encontrado")

# Rotas CRUD para Usuários

@app.post("/usuarios/", response_model=Usuario)
def create_usuario(usuario: Usuario):
    usuario.id = len(usuarios_db) + 1
    usuarios_db.append(usuario)
    return usuario

@app.get("/usuarios/", response_model=List[Usuario])
def read_usuarios():
    return usuarios_db

@app.get("/usuarios/{usuario_id}", response_model=Usuario)
def read_usuario(usuario_id: int):
    for usuario in usuarios_db:
        if usuario.id == usuario_id:
            return usuario
    raise HTTPException(status_code=404, detail="Usuário não encontrado")

@app.put("/usuarios/{usuario_id}", response_model=Usuario)
def update_usuario(usuario_id: int, usuario_update: Usuario):
    for index, usuario in enumerate(usuarios_db):
        if usuario.id == usuario_id:
            usuarios_db[index] = usuario_update
            usuario_update.id = usuario_id # Garante que o ID original seja mantido
            return usuario_update
    raise HTTPException(status_code=404, detail="Usuário não encontrado")

@app.delete("/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int):
    global usuarios_db
    initial_len = len(usuarios_db)
    usuarios_db = [usuario for usuario in usuarios_db if usuario.id != usuario_id]
    if len(usuarios_db) < initial_len:
        return {"message": f"Usuário com ID {usuario_id} deletado"}
    raise HTTPException(status_code=404, detail="Usuário não encontrado")

# Rotas CRUD para Regiões

@app.post("/regioes/", response_model=Regiao)
def create_regiao(regiao: Regiao):
    regiao.id = len(regioes_db) + 1
    regioes_db.append(regiao)
    return regiao

@app.get("/regioes/", response_model=List[Regiao])
def read_regioes():
    return regioes_db

@app.get("/regioes/{regiao_id}", response_model=Regiao)
def read_regiao(regiao_id: int):
    for regiao in regioes_db:
        if regiao.id == regiao_id:
            return regiao
    raise HTTPException(status_code=404, detail="Região não encontrada")

@app.put("/regioes/{regiao_id}", response_model=Regiao)
def update_regiao(regiao_id: int, regiao_update: Regiao):
    for index, regiao in enumerate(regioes_db):
        if regiao.id == regiao_id:
            regioes_db[index] = regiao_update
            regiao_update.id = regiao_id # Garante que o ID original seja mantido
            return regiao_update
    raise HTTPException(status_code=404, detail="Região não encontrada")

@app.delete("/regioes/{regiao_id}")
def delete_regiao(regiao_id: int):
    global regioes_db
    initial_len = len(regioes_db)
    regioes_db = [regiao for regiao in regioes_db if regiao.id != regiao_id]
    if len(regioes_db) < initial_len:
        return {"message": f"Região com ID {regiao_id} deletada"}
    raise HTTPException(status_code=404, detail="Região não encontrada")


