// retroId -> Set<WebSocket>
const rooms = new Map()

function join(retroId, ws) {
  if (!rooms.has(retroId)) rooms.set(retroId, new Set())
  rooms.get(retroId).add(ws)
}

function leave(retroId, ws) {
  rooms.get(retroId)?.delete(ws)
}

function broadcast(retroId, data) {
  const msg = JSON.stringify(data)
  rooms.get(retroId)?.forEach(ws => {
    if (ws.readyState === 1) ws.send(msg)
  })
}

module.exports = { join, leave, broadcast }
