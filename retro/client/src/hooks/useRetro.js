import { useState, useEffect, useRef } from 'react'

export function useRetro(retroId) {
  const [cards,   setCards]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const wsRef = useRef(null)

  const addCard = (card) =>
    setCards(prev => prev.some(c => c.id === card.id) ? prev : [...prev, card])

  useEffect(() => {
    if (!retroId) return

    // Load initial state
    fetch(`/api/retros/${retroId}`)
      .then(r => {
        if (!r.ok) throw new Error('not_found')
        return r.json()
      })
      .then(data => { setCards(data.cards); setLoading(false) })
      .catch(e  => { setError(e.message);   setLoading(false) })

    // WebSocket for real-time updates
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    const ws    = new WebSocket(`${proto}://${location.host}/ws/${retroId}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'card_added') addCard(msg.card)
    }

    return () => ws.close()
  }, [retroId])

  const postCard = async (columnId, text) => {
    const res  = await fetch(`/api/retros/${retroId}/cards`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ column_id: columnId, text }),
    })
    if (res.ok) {
      const card = await res.json()
      addCard(card) // optimistic: may already arrive via WS, dedup handles it
    }
  }

  return { cards, loading, error, postCard }
}
