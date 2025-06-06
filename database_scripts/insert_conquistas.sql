-- Limpar a tabela antes de inserir as conquistas iniciais (opcional, dependendo se as conquistas já existem)
DELETE FROM conquistas;

-- Inserir conquistas iniciais
INSERT ALL
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (1, 'Primeiro Relato', 'Enviou seu primeiro relato', 'star', '#FFD700', 10)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (2, 'Contribuidor Fiel', 'Enviou 10 relatos', 'military-tech', '#4CAF50', 50)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (3, 'Vigilante Noturno', 'Enviou 5 relatos durante a noite', 'nightlight-round', '#9C27B0', 30)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (4, 'Ajudante Local', 'Relato validado pelas autoridades', 'check-circle', '#2196F3', 100)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (5, 'Observador Atento', 'Enviou relatos em 3 regiões diferentes', 'location-on', '#FF9800', 40)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (6, 'Comunicador Eficiente', 'Enviou relatos em 5 dias diferentes', 'event', '#E91E63', 60)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (7, 'Cidadão Exemplar', 'Atingiu 500 pontos', 'emoji-events', '#673AB7', 200)
    INTO conquistas (id, nome, descricao, icone, cor, pontos_necessarios) VALUES (8, 'Guardião da Comunidade', 'Atingiu 1000 pontos', 'security', '#795548', 500)
SELECT * FROM dual;

-- Dropar sequence se existir (ignora erro se não existir)
BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE conquista_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN
         RAISE;
      END IF;
END;
/

-- Criar sequence para conquistas
CREATE SEQUENCE conquista_seq
    START WITH 9
    INCREMENT BY 1
    NOCACHE
    NOCYCLE; 