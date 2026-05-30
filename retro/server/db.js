require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     process.env.POSTGRES_PORT     || 5432,
  database: process.env.POSTGRES_DB       || 'retro',
  user:     process.env.POSTGRES_USER     || 'retro',
  password: process.env.POSTGRES_PASSWORD || 'retro',
})

async function connect(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1')
      console.log('DB connected')
      return
    } catch {
      console.log(`DB not ready, retry ${i + 1}/${retries}...`)
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  throw new Error('DB connection failed')
}

module.exports = { query: (text, params) => pool.query(text, params), connect }
