import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const create = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/retros', { method: 'POST' })
      const data = await res.json()
      navigate(`/retro/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <div className="home-card">
        <div className="home-icon">🔄</div>
        <h1>Ретроспектива команды</h1>
        <p>Создайте доску, поделитесь ссылкой — и вся команда сможет добавлять карточки в реальном времени.</p>
        <button className="btn-primary" onClick={create} disabled={loading}>
          {loading ? 'Создаём...' : 'Создать ретроспективу'}
        </button>
      </div>
    </div>
  )
}
