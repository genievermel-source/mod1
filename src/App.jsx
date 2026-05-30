import { useEffect, useRef, useState } from 'react'
import './App.css'

const TWO_PI = Math.PI * 2

// Orbital ring radii as fraction of min(W,H)/2
const RING_FRACS = [0.17, 0.30, 0.45]

const NODES = [
  // Ring 0 — AI core (cyan)
  { ring: 0, a0: 0.5,                    speed: 1.0,  label: '🤖 AI Models',  sub: 'Claude · GPT · Gemini',    color: '#00f0ff' },
  { ring: 0, a0: 0.5 + Math.PI,          speed: 1.0,  label: '📊 Data',       sub: 'Train · Eval · Fine-tune', color: '#00f0ff' },
  // Ring 1 — People (pink)
  { ring: 1, a0: 0.2,                    speed: 0.62, label: '👥 Users',       sub: 'NPS · Friction · Love',    color: '#ff79c6' },
  { ring: 1, a0: 0.2 + TWO_PI / 3,      speed: 0.62, label: '⚙️ Engineers',   sub: 'Latency · Cost · Drift',   color: '#ff79c6' },
  { ring: 1, a0: 0.2 + (TWO_PI * 2) / 3,speed: 0.62, label: '💼 Exec',        sub: 'ROI · OKRs · Vision',      color: '#ff79c6' },
  // Ring 2 — Outcomes (gold)
  { ring: 2, a0: 1.0,                    speed: 0.38, label: '🗺️ Roadmap',    sub: 'Bets · Cuts · Scope',      color: '#f1fa8c' },
  { ring: 2, a0: 1.0 + TWO_PI / 3,      speed: 0.38, label: '📈 Metrics',     sub: 'DAU · Revenue · Recall',   color: '#f1fa8c' },
  { ring: 2, a0: 1.0 + (TWO_PI * 2) / 3,speed: 0.38, label: '🚀 Releases',    sub: 'Canary · Ship · Revert',   color: '#f1fa8c' },
]

const EVENTS = [
  ['🚨 Hallucination in prod!',      'crisis'],
  ['📉 Accuracy dropped 12%',        'crisis'],
  ['⚡ P99 latency: 8 seconds',      'crisis'],
  ['🧪 Prompt broke after deploy',   'crisis'],
  ['💸 GPU costs spiked 3×',         'crisis'],
  ['💡 User: "It feels dumb"',       'warn'],
  ['📊 Board wants AI roadmap NOW',  'warn'],
  ['🔐 Legal flagged the outputs',   'warn'],
  ['📌 CEO wants ETA',               'warn'],
  ['🎯 Demo in 15 min',              'warn'],
  ['🤔 Is this output biased?',      'think'],
  ['🔄 Retrain or fine-tune?',       'think'],
  ['🚀 Ship it or iterate?',         'think'],
  ['🧠 What does "better" mean here?','think'],
  ['✅ A/B test: variant wins!',      'win'],
  ['🎉 Feature hit 10k users!',       'win'],
  ['🏆 NPS up 8 points this week',    'win'],
  ['🧬 New frontier model dropped',   'info'],
]

const THOUGHTS = [
  'Will this scale to 1M users?',
  'Ship it. No — iterate. No — ship it.',
  'How do we even measure "trust"?',
  'Is the model lying or just wrong?',
  'Don\'t let perfect kill good.',
  'What are we actually optimizing for?',
  'Does the model know what it doesn\'t know?',
  'We need more data. Or do we?',
  'Who owns the model\'s mistakes?',
  'Is this useful, or just impressive?',
]

export default function App() {
  const canvasRef  = useRef(null)
  const nodeEls    = useRef([])
  const tRef       = useRef(0)
  const particles  = useRef([])
  const stars      = useRef([])
  const [events, setEvents]   = useState([])
  const [thought, setThought] = useState(THOUGHTS[0])

  // Initialise star field once
  useEffect(() => {
    stars.current = Array.from({ length: 160 }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      r:  Math.random() * 1.2 + 0.2,
      a:  Math.random() * 0.5 + 0.1,
      ts: Math.random() * 0.025 + 0.008,
      to: Math.random() * TWO_PI,
    }))
  }, [])

  // Main canvas + DOM animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodePos = (node, t, W, H) => {
      const r = RING_FRACS[node.ring] * Math.min(W, H) * 0.5
      const a = node.a0 + t * 0.001 * node.speed
      return { x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r }
    }

    const loop = () => {
      const t  = ++tRef.current
      const W  = canvas.width
      const H  = canvas.height
      const cx = W / 2
      const cy = H / 2

      // Translucent clear — creates motion blur / trail
      ctx.fillStyle = 'rgba(3,3,16,0.80)'
      ctx.fillRect(0, 0, W, H)

      // Twinkling stars
      stars.current.forEach(s => {
        const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.ts + s.to))
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, TWO_PI)
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`
        ctx.fill()
      })

      // Compute all node positions
      const pos = NODES.map(n => nodePos(n, t, W, H))

      // Dashed orbital rings
      RING_FRACS.forEach((rf, i) => {
        const r = rf * Math.min(W, H) * 0.5
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, TWO_PI)
        ctx.strokeStyle = `rgba(80,180,255,${0.05 + i * 0.025})`
        ctx.lineWidth = 1
        ctx.setLineDash([2, 14])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Dim radial spoke lines
      pos.forEach((p, i) => {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(cx, cy)
        ctx.strokeStyle = NODES[i].color + '14'
        ctx.lineWidth   = 1
        ctx.stroke()
      })

      // Spawn a particle occasionally
      if (Math.random() < 0.3) {
        const i        = Math.floor(Math.random() * NODES.length)
        const toCenter = Math.random() > 0.35
        particles.current.push({
          i, toCenter,
          progress: 0,
          speed: 0.005 + Math.random() * 0.009,
          size:  1.5  + Math.random() * 2.5,
          color: NODES[i].color,
        })
      }

      // Draw & advance particles
      particles.current = particles.current.filter(p => p.progress < 1)
      particles.current.forEach(p => {
        p.progress += p.speed
        const np = pos[p.i]
        const [fx, fy] = p.toCenter ? [np.x, np.y] : [cx, cy]
        const [tx, ty] = p.toCenter ? [cx, cy]     : [np.x, np.y]
        const x     = fx + (tx - fx) * p.progress
        const y     = fy + (ty - fy) * p.progress
        const alpha = Math.sin(p.progress * Math.PI)
        const hex   = Math.round(alpha * 230).toString(16).padStart(2, '0')
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, TWO_PI)
        ctx.fillStyle = p.color + hex
        ctx.fill()
      })

      // Multi-layer center glow
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.04)
      ;[{ r: 72, a: 0.06 }, { r: 46, a: 0.13 }, { r: 28, a: 0.24 }].forEach(({ r, a }) => {
        const pr = r + pulse * 10
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr)
        g.addColorStop(0, `rgba(0,240,255,${(a + pulse * 0.08).toFixed(2)})`)
        g.addColorStop(1, 'rgba(0,240,255,0)')
        ctx.beginPath()
        ctx.arc(cx, cy, pr, 0, TWO_PI)
        ctx.fillStyle = g
        ctx.fill()
      })

      // Move DOM chip nodes directly — no React re-render
      pos.forEach((p, i) => {
        const el = nodeEls.current[i]
        if (el) { el.style.left = p.x + 'px'; el.style.top = p.y + 'px' }
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Incoming event stream
  useEffect(() => {
    let id = 0
    const fire = () => {
      const [msg, type] = EVENTS[Math.floor(Math.random() * EVENTS.length)]
      const eid = id++
      setEvents(prev => [...prev.slice(-5), { msg, type, id: eid }])
      setTimeout(() => setEvents(prev => prev.filter(e => e.id !== eid)), 4200)
    }
    fire()
    const iv = setInterval(fire, 2600)
    return () => clearInterval(iv)
  }, [])

  // Rotating thought ticker
  useEffect(() => {
    let i = 0
    const iv = setInterval(() => { i = (i + 1) % THOUGHTS.length; setThought(THOUGHTS[i]) }, 3600)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="app">
      <canvas ref={canvasRef} className="canvas" />

      <header className="header">
        <h1>What it's like to be an AI PM</h1>
        <p>Everything. All at once. All the time.</p>
      </header>

      {NODES.map((n, i) => (
        <div
          key={i}
          ref={el => nodeEls.current[i] = el}
          className="node"
          style={{ '--c': n.color, '--cg': n.color + '38' }}
        >
          <span className="node-label">{n.label}</span>
          <span className="node-sub">{n.sub}</span>
        </div>
      ))}

      <div className="center">
        <div className="center-ring" />
        <div className="center-core">
          <span className="center-icon">🧠</span>
          <span className="center-text">AI PM</span>
        </div>
      </div>

      <div className="thought-bar">
        <span>💭</span>
        <span className="thought-msg" key={thought}>{thought}</span>
      </div>

      <aside className="event-feed">
        {events.map(e => (
          <div key={e.id} className={`evt evt-${e.type}`}>{e.msg}</div>
        ))}
      </aside>
    </div>
  )
}
