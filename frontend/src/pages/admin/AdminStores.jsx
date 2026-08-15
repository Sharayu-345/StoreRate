import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import SortableTable from '../../components/SortableTable'
import StarRating from '../../components/StarRating'

export default function AdminStores() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [loading, setLoading] = useState(true)

  async function fetchStores() {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/stores', { params: filters })
      setStores(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'average_rating',
      label: 'Rating',
      sortable: true,
      render: (row) => {
        const rating = row.average_rating ? Number(row.average_rating) : 0
        return (
          <span className="flex items-center gap-1">
            <StarRating value={rating} readOnly size="text-sm" />
            <span className="text-xs text-slate-400">({rating ? rating.toFixed(1) : '—'})</span>
          </span>
        )
      },
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Stores</h1>
        <Link
          to="/admin/stores/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add store
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          fetchStores()
        }}
        className="mb-6 flex flex-wrap gap-3"
      >
        {['name', 'email', 'address'].map((field) => (
          <input
            key={field}
            placeholder={`Filter by ${field}`}
            value={filters[field]}
            onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        ))}
        <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900">
          Filter
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading stores...</p>
      ) : (
        <SortableTable columns={columns} rows={stores} />
      )}
    </div>
  )
}