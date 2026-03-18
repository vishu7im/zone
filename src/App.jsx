import { useState } from 'react'

const API_URL = 'https://banquetmicroservice.banquetfirst.com/api/v1/others/fetch-by-city-zones'

const STORAGE_KEY = 'byzone_last_search'

const DEFAULT_FORM = {
  query: '',
  keywords: [],
  city: '',
  state: '',
  radius: 5,
  limit: 50,
  format: 'json',
}

function KeywordInput({ keywords, onChange }) {
  const [inputVal, setInputVal] = useState('')

  const addKeyword = (val) => {
    const trimmed = val.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed])
    }
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword(inputVal)
    } else if (e.key === 'Backspace' && !inputVal && keywords.length > 0) {
      onChange(keywords.slice(0, -1))
    }
  }

  const removeKeyword = (kw) => {
    onChange(keywords.filter((k) => k !== kw))
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-[42px]">
      {keywords.map((kw) => (
        <span
          key={kw}
          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full"
        >
          {kw}
          <button
            type="button"
            onClick={() => removeKeyword(kw)}
            className="text-blue-500 hover:text-blue-800 leading-none ml-0.5"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addKeyword(inputVal)}
        placeholder={keywords.length === 0 ? 'Type keyword and press Enter' : ''}
        className="outline-none flex-1 min-w-[140px] text-sm py-0.5"
      />
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}

function ResultsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No results found for your search.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Mobile</th>
            <th className="px-4 py-3 font-semibold">Address</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Reviews</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                {row.name || row.Name || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {row.mobile || row.Mobile || row.phone || row.Phone || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-[240px]">
                <span title={row.address || row.Address || ''}>
                  {row.address || row.Address || '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                {row.rating || row.Rating ? (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <span>★</span>
                    {row.rating || row.Rating}
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {row.reviews || row.Reviews || row.review_count || '—'}
              </td>
              <td className="px-4 py-3">
                {(row.status || row.Status) ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    String(row.status || row.Status).toLowerCase() === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {row.status || row.Status}
                  </span>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CSVPreviewTable({ csvText }) {
  const lines = csvText.trim().split('\n').filter(Boolean)
  if (lines.length === 0) return <div className="text-center py-12 text-gray-500">No data to preview.</div>

  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim())
  const rows = lines.slice(1, 6).map((line) =>
    line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim())
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <p className="text-xs text-gray-400 px-4 py-2 bg-gray-50 border-b border-gray-200">
        Showing first {rows.length} of {lines.length - 1} rows
      </p>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-700">{cell || '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM
    } catch {
      return DEFAULT_FORM
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null) // { type: 'json'|'csv', data }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const buildURL = () => {
    const params = new URLSearchParams()
    params.set('query', form.query)
    form.keywords.forEach((kw) => params.append('keywords', kw))
    params.set('city', form.city)
    params.set('state', form.state)
    params.set('radius', form.radius)
    params.set('limit', form.limit)
    params.set('format', form.format)
    return `${API_URL}?${params.toString()}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {}

    try {
      const url = buildURL()
      const res = await fetch(url, { headers: { accept: '*/*' } })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      if (form.format === 'csv') {
        const text = await res.text()
        setResult({ type: 'csv', data: text })
      } else {
        const json = await res.json()
        // Handle various response shapes
        const rows = Array.isArray(json)
          ? json
          : json.data || json.results || json.items || []
        setResult({ type: 'json', data: rows, raw: json })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadJSON = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result.raw ?? result.data, null, 2)], {
      type: 'application/json',
    })
    triggerDownload(blob, 'results.json')
  }

  const downloadCSV = () => {
    if (!result) return
    const blob = new Blob([result.data], { type: 'text/csv' })
    triggerDownload(blob, 'results.csv')
  }

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            ByZone Search
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Search businesses by city zones using keywords and location filters
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Query */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Query <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.query}
                onChange={(e) => set('query', e.target.value)}
                placeholder="e.g. Mechanic in Mysore Karnataka"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Keywords */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Keywords
              </label>
              <KeywordInput
                keywords={form.keywords}
                onChange={(kws) => set('keywords', kws)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Type a keyword and press Enter or comma to add
              </p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="e.g. Jind"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                placeholder="e.g. Haryana"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Radius (km)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.radius}
                onChange={(e) => set('radius', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Limit
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={form.limit}
                onChange={(e) => set('limit', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Format
              </label>
              <select
                value={form.format}
                onChange={(e) => set('format', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠</span>
            <div>
              <p className="text-red-700 font-medium text-sm">Request failed</p>
              <p className="text-red-600 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Results</h2>
                {result.type === 'json' && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {result.data.length} record{result.data.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {result.type === 'json' && (
                  <button
                    onClick={downloadJSON}
                    className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    ↓ Download JSON
                  </button>
                )}
                {result.type === 'csv' && (
                  <button
                    onClick={downloadCSV}
                    className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    ↓ Download CSV
                  </button>
                )}
              </div>
            </div>

            {result.type === 'json' && <ResultsTable data={result.data} />}
            {result.type === 'csv' && <CSVPreviewTable csvText={result.data} />}
          </div>
        )}
      </div>
    </div>
  )
}
