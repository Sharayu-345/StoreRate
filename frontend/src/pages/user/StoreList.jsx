import { useEffect, useState } from 'react'
import api from '../../api/axios'
import StarRating from '../../components/StarRating'

export default function StoreList() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ name: '', address: '' })
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' })
  const [savingId, setSavingId] = useState(null)

  async function fetchStores() {
    setLoading(true)
    try {
      const { data } = await api.get('/stores', { params: { ...search, ...sort } })
      setStores(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  function handleSearch(e) {
    e.preventDefault()
    fetchStores()
  }

  function toggleOrder() {
    setSort((s) => ({ ...s, order: s.order === 'asc' ? 'desc' : 'asc' }))
  }

  async function submitRating(storeId, rating) {
    setSavingId(storeId)
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating })
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, user_rating: rating } : s))
      )
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-800">Stores</h1>

      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <input
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Search
        </button>
      </form>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <label className="text-slate-500">Sort by</label>
        <select
          value={sort.sortBy}
          onChange={(e) => setSort((s) => ({ ...s, sortBy: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
        <button
          type="button"
          onClick={toggleOrder}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          {sort.order === 'asc' ? 'Ascending \u25B2' : 'Descending \u25BC'}
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading stores...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.length === 0 && <p className="text-slate-400">No stores found.</p>}
          {stores.map((store) => (
            <div key={store.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-medium text-slate-800">{store.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{store.address}</p>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Overall rating</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <StarRating value={store.average_rating || 0} readOnly size="text-sm" />
                  <span className="text-xs text-slate-400">
                    ({store.average_rating ? Number(store.average_rating).toFixed(1) : '—'})
                  </span>
                </span>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="mb-1 text-sm text-slate-500">
                  {store.user_rating ? 'Your rating' : 'Rate this store'}
                </p>
                <StarRating
                  value={store.user_rating || 0}
                  onChange={(rating) => submitRating(store.id, rating)}
                />
                {savingId === store.id && <p className="mt-1 text-xs text-slate-400">Saving...</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}