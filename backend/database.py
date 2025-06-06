import os
# import oracledb # Já importado pelo sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Removida a parte inicial de conexão direta

# Configurações de conexão com o banco de dados Oracle usando variáveis de ambiente
# É ALTAMENTE recomendado usar variáveis de ambiente para as credenciais
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
# Formato DB_CONNECT_STRING: "hostname:port/servicename" ou um nome TNS
DB_CONNECT_STRING = os.environ.get("DB_CONNECT_STRING") 

# Verifica se as variáveis de ambiente estão configuradas
if not DB_USER or not DB_PASSWORD or not DB_CONNECT_STRING:
    print("ERROR: Variáveis de ambiente do banco de dados não configuradas (DB_USER, DB_PASSWORD, DB_CONNECT_STRING).")
    # Em um ambiente de produção, você pode querer encerrar a aplicação aqui
    # raise EnvironmentError("Database credentials not set in environment variables")

# URL de conexão para SQLAlchemy usando o driver oracledb
# O formato da URL é 'oracle+oracledb://user:password@dsn' ou 'oracle+oracledb://user:password@host:port/servicename'
# Usaremos o formato com DSN/connect string fornecido na variável DB_CONNECT_STRING
SQLALCHEMY_DATABASE_URL = f"oracle+oracledb://{DB_USER}:{DB_PASSWORD}@{DB_CONNECT_STRING}"

# Cria o engine do SQLAlchemy
# disable_cx_oracle_connector=True é necessário ao usar python-oracledb em vez de cx_Oracle
# enable_async=True se você for usar async, mas por enquanto usamos síncrono
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # Adicionar opções como pool_size, max_overflow conforme necessário para a produção
    # disable_cx_oracle_connector=True # Removido pois create_engine com +oracledb deve gerenciar isso
)

# Cria uma SessionLocal class
# Cada instância da classe SessionLocal será uma sessão de banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Função de dependência para obter uma sessão de banco de dados
# Esta função será usada nas rotas do FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Exemplo de como usar (principalmente para testar a conexão inicial se descomentado em main.py)
# def check_connection():
#     try:
#         # Tenta obter uma sessão
#         with engine.connect() as connection:
#             # Executa um comando simples para verificar a conexão
#             connection.execute(text("SELECT 1 FROM dual")) # É necessário importar 'text' do sqlalchemy
#         print("INFO: Conexão com o banco de dados Oracle estabelecida com sucesso!")
#         return True
#     except Exception as e:
#         print(f"ERROR: Falha ao estabelecer conexão com o banco de dados Oracle: {e}")
#         return False 