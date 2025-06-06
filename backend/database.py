import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import oracledb # Importar o driver oracledb

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Recuperar credenciais e detalhes de conexão do Oracle das variáveis de ambiente
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT") # PORTA deve vir como string do .env
DB_SID = os.getenv("DB_SID")   # Pode ser SID ou SERVICE_NAME dependendo da config do banco

# Verificar se as variáveis de ambiente essenciais foram carregadas
if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SID]):
    # Se as variáveis não estiverem definidas, usaremos um banco de dados SQLite em memória como fallback temporário
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    print("Aviso: Variáveis de ambiente do Oracle incompletas. Usando SQLite em memória como fallback.")
else:
    try:
        # Construir o DSN usando oracledb.makedsn
        # oracledb.makedsn espera a porta como int
        dsn_tns = oracledb.makedsn(host=DB_HOST, port=int(DB_PORT), sid=DB_SID) # Use sid= ou service_name= conforme necessário
        
        # Montar a URL de conexão para o Oracle usando o DSN gerado
        # Formato esperado: oracle+oracledb://user:password@dsn_string
        SQLALCHEMY_DATABASE_URL = f"oracle+oracledb://{DB_USER}:{DB_PASSWORD}@{dsn_tns}"
        print(f"Usando Oracle para a conexão com o banco de dados em {DB_HOST}:{DB_PORT} com SID/Service Name {DB_SID}.")

    except Exception as e:
        print(f"Erro ao configurar conexão Oracle: {e}")
        # Em caso de erro na configuração do DSN, fallback para SQLite
        SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
        print("Aviso: Erro na configuração do Oracle. Usando SQLite em memória como fallback.")


# Criar o engine do SQLAlchemy
# O argumento arraysize=1000 é uma otimização para oracledb
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {},
    #echo=True, # Descomente para ver as queries SQL geradas (útil para debug)
    # arraysize=1000 if "oracle" in SQLALCHEMY_DATABASE_URL else None
    # Adicionar pool_pre_ping=True pode ajudar com conexões ociosas (opcional)
    # pool_pre_ping=True
)

# Criar a sessão do banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos declarativos
Base = declarative_base()

# Função de dependência para obter a sessão do banco de dados
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