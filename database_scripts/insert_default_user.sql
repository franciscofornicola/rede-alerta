-- Deletar usuário padrão (ID 1) se existir para evitar duplicidade
DELETE FROM usuarios WHERE id = 1;

-- Inserir usuário padrão com ID 1
INSERT INTO usuarios (id, nome, email, senha_hashed, nivel, pontos)
VALUES (1, 'Usuário Padrão', 'usuario.padrao@example.com', 'senha_hashed_aqui', 1, 0);

-- Para garantir que a sequence de usuarios não tente reutilizar o 1
-- (Opcional, dependendo da configuração da sequence de ID)
-- SELECT user_seq.NEXTVAL FROM dual; -- Substitua user_seq pelo nome da sequence de usuarios se houver uma

COMMIT; 