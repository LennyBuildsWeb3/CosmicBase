import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROJECT_ID = import.meta.env.VITE_VERYCHAT_PROJECT_ID

export function Login() {
  const navigate = useNavigate()
  const [handle, setHandle] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'handle' | 'code'>('handle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendCode = async () => {
    if (!handle.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://gapi.veryapi.io/auth/request-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: PROJECT_ID, handle })
      })
      if (!res.ok) throw new Error('Failed to send code')
      setStep('code')
    } catch {
      setError('Failed to send code. Check your handle.')
    }
    setLoading(false)
  }

  const verify = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://gapi.veryapi.io/auth/get-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: PROJECT_ID, handle, code })
      })
      if (!res.ok) throw new Error('Invalid code')
      const data = await res.json()
      localStorage.setItem('verychat_token', data.accessToken)
      localStorage.setItem('verychat_handle', handle)
      navigate('/calculate')
    } catch {
      setError('Invalid code. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔐 Login with VeryChat</h1>
        <p className="text-gray-400">Secure authentication via VeryChat app</p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur space-y-4">
        {step === 'handle' ? (
          <>
            <div>
              <label className="block text-sm text-gray-400 mb-1">VeryChat Handle</label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="your_handle"
                className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-white"
              />
            </div>
            <button
              onClick={sendCode}
              disabled={loading || !handle.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg font-medium transition text-white"
            >
              {loading ? '⏳ Sending...' : '📱 Send Code'}
            </button>
          </>
        ) : (
          <>
            <p className="text-center text-gray-300">Code sent to <span className="text-purple-400">@{handle}</span></p>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter code from VeryChat"
                className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-white text-center text-2xl tracking-widest"
              />
            </div>
            <button
              onClick={verify}
              disabled={loading || !code.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 rounded-lg font-medium transition text-white"
            >
              {loading ? '⏳ Verifying...' : '✨ Login'}
            </button>
            <button
              onClick={() => { setStep('handle'); setCode(''); setError('') }}
              className="w-full py-2 text-gray-400 hover:text-white transition"
            >
              ← Change handle
            </button>
          </>
        )}
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
      </div>

      <button
        onClick={() => navigate('/calculate')}
        className="w-full mt-4 py-2 text-gray-500 hover:text-gray-300 transition"
      >
        Skip login →
      </button>
    </div>
  )
}
