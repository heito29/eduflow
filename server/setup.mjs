import { readFile } from 'node:fs/promises'
import { pool } from './db.mjs'

try {
  const sql = await readFile(new URL('../database/001_create_tasks.sql', import.meta.url), 'utf8')
  await pool.query(sql)
  console.log('Tabela tasks criada no PostgreSQL!')
} catch (error) {
  console.error('Não foi possível criar a tabela:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
