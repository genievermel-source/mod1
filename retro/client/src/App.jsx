import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home  from './pages/Home.jsx'
import Board from './pages/Board.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/retro/:id"  element={<Board />} />
      </Routes>
    </BrowserRouter>
  )
}
