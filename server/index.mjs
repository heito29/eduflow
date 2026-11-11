import express from 'express'
import { pool } from './db.mjs'
import { validateId, validateTitle } from './validate.mjs'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))

// Exemplo local para estudo. Não exponha na internet sem adicionar login/autorização.
app.get('/api/tasks', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT id, title, done FROM tasks ORDER BY id DESC')
    res.json(result.rows)
  } catch (error) { next(error) }
})

app.post('/api/tasks', async (req, res, next) => {
  try {
    const title = validateTitle(req.body?.title)
    if (!title) return res.status(400).json({ error: 'Digite uma tarefa com até 120 caracteres.' })
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done', [title]
    )
    res.status(201).json(result.rows[0])
  } catch (error) { next(error) }
})

app.patch('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id)
    if (!id || typeof req.body?.done !== 'boolean') {
      return res.status(400).json({ error: 'Dados inválidos.' })
    }
    const result = await pool.query(
      'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING id, title, done',
      [req.body.done, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Tarefa não encontrada.' })
    res.json(result.rows[0])
  } catch (error) { next(error) }
})

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id)
    if (!id) return res.status(400).json({ error: 'ID inválido.' })
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Tarefa não encontrada.' })
    res.status(204).end()
  } catch (error) { next(error) }
})

app.use((error, _req, res, _next) => {
  console.error('Erro da API:', error)
  res.status(500).json({ error: 'Ocorreu um erro no servidor. Confira a conexão PostgreSQL.' })
})

const port = Number(process.env.PORT) || 3001
app.listen(port, '127.0.0.1', () => {
  console.log(`API EduFlow rodando em http://127.0.0.1:${port}`)
})
