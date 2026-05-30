require('dotenv').config()
const http       = require('http')
const express    = require('express')
const cors       = require('cors')
const { WebSocketServer } = require('ws')
const db         = require('./db')
const wsRooms    = require('./ws')

const app    = express()
const server = http.createServer(app)
const wss    = new WebSocketServer({ noServer: true })

app.use(cors())
app.use(express.json())
app.use('/api/retros', require('./routes/retro'))

// WebSocket upgrade: /ws/:retroId
server.on('upgrade', (req, socket, head) => {
  const match = req.url.match(/^\/ws\/([a-f0-9-]{36})$/)
  if (!match) return socket.destroy()

  wss.handleUpgrade(req, socket, head, (ws) => {
    const retroId = match[1]
    ws.retroId = retroId
    wsRooms.join(retroId, ws)
    ws.on('close', () => wsRooms.leave(retroId, ws))
    ws.on('error', () => wsRooms.leave(retroId, ws))
  })
})

const PORT = process.env.PORT || 3001

db.connect().then(() => {
  server.listen(PORT, () => console.log(`Server listening on :${PORT}`))
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
