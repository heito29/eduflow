import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL. Copie .env.example para .env e configure o banco.')
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 5,
})
