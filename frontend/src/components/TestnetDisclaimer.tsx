'use client'

import { useState, useEffect } from 'react'

export function TestnetDisclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('cosmicbase-testnet-disclaimer')
    if (!dismissed) {
      setIsOpen(true)
    }
  }, [])

  const handleDismiss = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('cosmicbase-testnet-disclaimer', 'true')
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-500/20">
        {/* Warning Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-yellow-400">Sepolia Testnet</h2>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            This application is running on <strong className="text-purple-300">Ethereum Sepolia testnet</strong>.
            Do not use tokens with real value.
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Built for the <strong className="text-purple-300">Zama AI Guild Developer Program - Builder Track</strong>.
          </p>

          {/* Privacy Notice */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-xs leading-relaxed">
              <strong className="text-gray-300">Privacy:</strong> Your birth data is encrypted using FHE and stored on-chain.
              Only you can decrypt it. We do not store your personal information on any centralized server.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer group">
          <input
            type="checkbox"
            id="dontShowAgain"
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
          />
          <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
            Don't show this again
          </span>
        </label>

        {/* Button */}
        <button
          onClick={() => {
            const checkbox = document.getElementById('dontShowAgain') as HTMLInputElement
            handleDismiss(checkbox?.checked || false)
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          I Understand
        </button>
      </div>
    </div>
  )
}
