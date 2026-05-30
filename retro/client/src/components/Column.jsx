import { useState } from 'react'
import Card from './Card.jsx'

export default function Column({ column, cards, onAdd }) {
  const [open, setOpen]   = useState(false)
  const [text, setText]   = useState('')
  const [busy, setBusy]   = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    await onAdd(text)
    setText('')
    setBusy(false)
    setOpen(false)
  }

  return (
    <div className="column" style={{ '--col': column.color }}>
      <div className="column-header">
        <span>{column.emoji}</span>
        <span>{column.label}</span>
        <span className="column-count">{cards.length}</span>
      </div>

      <div className="cards-list">
        {cards.map(c => <Card key={c.id} card={c} />)}
      </div>

      <div className="column-footer">
        {open ? (
          <form className="add-form" onSubmit={submit}>
            <textarea
              autoFocus
              rows={3}
              placeholder="Введите текст..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submit(e) }}
            />
            <div className="add-form-actions">
              <button type="submit" className="btn-save" disabled={busy || !text.trim()}>
                {busy ? '...' : 'Добавить'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => { setOpen(false); setText('') }}>
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <button className="btn-add" onClick={() => setOpen(true)}>
            + Добавить карточку
          </button>
        )}
      </div>
    </div>
  )
}
