import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Calculate } from './pages/Calculate'
import { Result } from './pages/Result'
import { Daily } from './pages/Daily'
import { Compatibility } from './pages/Compatibility'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/result" element={<Result />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/compatibility" element={<Compatibility />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
