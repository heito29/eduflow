# EduFlow — versão inicial (sem Supabase)

Um projeto **pequeno e didático**: uma lista de tarefas de estudo usando **React + TypeScript**, **Node.js + Express** e **PostgreSQL local**.

## O que faz

- Cadastra tarefas.
- Lista tarefas salvas no PostgreSQL.
- Marca ou desmarca tarefas como concluídas.
- Exclui tarefas.

**Por enquanto não tem:** login, turmas, horários, notas, Pomodoro ou relatórios. Essas funcionalidades podem ser adicionadas conforme você aprende.

## Passo a passo

### 1. Preparar o PostgreSQL

Instale o PostgreSQL e crie um banco vazio chamado `eduflow` pelo pgAdmin ou pelo SQL:

```sql
CREATE DATABASE eduflow;
```

O PostgreSQL precisa estar rodando na porta `5432`, ou ajuste a porta conforme sua instalação.

### 2. Preparar o projeto

Você precisa ter o Node.js instalado. No VS Code, abra um terminal dentro desta pasta.

```bash
npm install
```

Copie `.env.example` para `.env` e coloque **a senha do seu PostgreSQL local** na variável `DATABASE_URL`. Exemplo:

```env
DATABASE_URL=postgresql://postgres:MINHA_SENHA@127.0.0.1:5432/eduflow
PORT=3001
```

Se a senha tiver caracteres como `@`, `#` ou `:`, eles precisam ser codificados na URL. Não envie seu `.env` ao GitHub.

### 3. Criar a tabela

```bash
npm run db:setup
```

### 4. Executar

```bash
npm run dev
```

Abra **http://127.0.0.1:5173**. O navegador conversa com a API local e a API conversa com o PostgreSQL.

### 5. Testes simples

```bash
npm test
```

## Como está organizado

- `src/App.tsx`: interface e botões.
- `src/style.css`: aparência.
- `server/index.mjs`: API com as quatro operações.
- `server/db.mjs`: conexão ao PostgreSQL.
- `database/001_create_tasks.sql`: criação da tabela.

## Atenção à segurança

Esta versão **não possui login nem separação entre usuários**. Ela foi feita apenas para rodar **localmente em seu computador**. **Não publique a API em um servidor aberto à internet** antes de implementar autenticação, autorização, proteção contra abuso e configuração segura de produção.

O FOX não é usado nem acessado por este projeto. O EduFlow utiliza um banco e credenciais próprios.

## Próxima etapa sugerida

Quando esta versão estiver funcionando, adicione uma propriedade `description` a cada tarefa, atualizando a tabela, a API e a interface. Depois, crie testes para essa mudança. Esse é um bom exercício para avaliar o código de um assistente de IA.
