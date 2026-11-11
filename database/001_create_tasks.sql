-- Primeira versão: apenas tarefas de estudo, sem login.
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL CHECK (length(trim(title)) > 0),
    done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
