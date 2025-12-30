interface Props {
  value: { year: number; month: number; day: number; hour: number }
  onChange: (v: Props['value']) => void
}

export function BirthDateInput({ value, onChange }: Props) {
  const inputClass = "w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-white"
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Year</label>
        <input type="number" min="1900" max="2100" value={value.year}
          onChange={e => onChange({ ...value, year: +e.target.value })}
          className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Month</label>
        <input type="number" min="1" max="12" value={value.month}
          onChange={e => onChange({ ...value, month: +e.target.value })}
          className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Day</label>
        <input type="number" min="1" max="31" value={value.day}
          onChange={e => onChange({ ...value, day: +e.target.value })}
          className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Hour (0-23)</label>
        <input type="number" min="0" max="23" value={value.hour}
          onChange={e => onChange({ ...value, hour: +e.target.value })}
          className={inputClass} />
      </div>
    </div>
  )
}
