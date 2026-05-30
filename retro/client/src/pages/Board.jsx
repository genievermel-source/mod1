import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRetro }  from '../hooks/useRetro.js'
import Column        from '../components/Column.jsx'

const COLUMNS = [
  { id: 'good',    label: 'Что было хорошо',    emoji: '✅', color: '#22c55e' },
  { id: 'bad',     label: 'Что было плохо',     emoji: '❌', color: '#ef4444' },
  { id: 'thanks',  label: 'Благодарности',       emoji: '🙏', color: '#f59e0b' },
  { id: 'improve', label: 'Что можно улучшить',  emoji: '💡', color: '#3b82f6' },
]

export default function Board() {
  const { id }                  = useParams()
  const { cards, loading, error, postCard } = useRetro(id)
  const [copied, setCopied]     = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="center-msg">Загрузка...</div>
  if (error)   return <div className="center-msg error">Ретроспектива не найдена</div>

  return (
    <div className="board-page">
      <header className="board-header">
        <div className="board-title">
          <span>🔄</span>
          <span>Ретроспектива</span>
        </div>
        <button className="btn-copy" onClick={copyLink}>
          {copied ? '✓ Скопировано!' : '🔗 Поделиться ссылкой'}
        </button>
      </header>

      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter(c => c.column_id === col.id)}
            onAdd={(text) => postCard(col.id, text)}
          />
        ))}
      </div>
    </div>
  )
}
