'use client'

import { ChartCustomization, COLOR_THEMES, ColorTheme } from '@/types/customization'

interface CustomizationPanelProps {
  customization: ChartCustomization
  onChange: (customization: ChartCustomization) => void
}

export function CustomizationPanel({ customization, onChange }: CustomizationPanelProps) {
  return (
    <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-purple-500/20">
      <h3 className="text-xl font-bold text-purple-200">Customize Your Chart</h3>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          value={customization.displayName}
          onChange={e => onChange({ ...customization, displayName: e.target.value })}
          placeholder="Enter your name or nickname"
          maxLength={30}
          className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">This will appear on your birth chart</p>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium mb-3">Color Theme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.keys(COLOR_THEMES) as ColorTheme[]).map(themeKey => {
            const theme = COLOR_THEMES[themeKey]
            const isSelected = customization.colorTheme === themeKey

            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => onChange({ ...customization, colorTheme: themeKey })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-500/20 bg-white/5 hover:border-purple-500/50'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: theme.colors.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: theme.colors.secondary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: theme.colors.accent }}
                  />
                </div>
                <p className="text-sm font-medium">{theme.name}</p>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
