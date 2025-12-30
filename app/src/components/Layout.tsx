import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const handle = localStorage.getItem('verychat_handle')

  const logout = () => {
    localStorage.removeItem('verychat_token')
    localStorage.removeItem('verychat_handle')
    navigate('/')
  }

  return (
    <div className="min-h-screen relative">
      <div className="starfield"></div>
      <div className="relative z-10">
        <nav className="p-4 flex justify-between items-center border-b border-purple-900/30">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">☯</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              CosmicBase
            </span>
          </Link>
          <div className="flex gap-4 text-sm items-center">
            <Link to="/daily" className="text-purple-300 hover:text-white transition">Daily</Link>
            <Link to="/compatibility" className="text-pink-300 hover:text-white transition">Match</Link>
            {handle ? (
              <button onClick={logout} className="text-gray-400 hover:text-white transition">
                @{handle} ↪
              </button>
            ) : (
              <Link to="/login" className="text-green-400 hover:text-white transition">Login</Link>
            )}
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  )
}
