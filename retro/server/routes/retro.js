const router  = require('express').Router()
const { v4: uuid } = require('uuid')
const db      = require('../db')
const wsRooms = require('../ws')

// Create retro
router.post('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'INSERT INTO retros (id) VALUES ($1) RETURNING *',
      [uuid()]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Get retro + cards
router.get('/:id', async (req, res) => {
  try {
    const { rows: retros } = await db.query(
      'SELECT * FROM retros WHERE id = $1',
      [req.params.id]
    )
    if (!retros.length) return res.status(404).json({ error: 'Not found' })

    const { rows: cards } = await db.query(
      'SELECT * FROM cards WHERE retro_id = $1 ORDER BY created_at',
      [req.params.id]
    )
    res.json({ ...retros[0], cards })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Add card
router.post('/:id/cards', async (req, res) => {
  try {
    const { column_id, text } = req.body
    if (!column_id || !text?.trim()) {
      return res.status(400).json({ error: 'column_id and text are required' })
    }
    const { rows } = await db.query(
      'INSERT INTO cards (id, retro_id, column_id, text) VALUES ($1, $2, $3, $4) RETURNING *',
      [uuid(), req.params.id, column_id, text.trim()]
    )
    const card = rows[0]
    wsRooms.broadcast(req.params.id, { type: 'card_added', card })
    res.json(card)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
