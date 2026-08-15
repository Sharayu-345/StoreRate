import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/dashboard')
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard stats')
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total users', value: stats?.totalUsers, to: '/admin/users' },
    { label: 'Total stores', value: stats?.totalStores, to: '/admin/stores' },
    { label: 'Total ratings', value: stats?.totalRatings, to: '/admin/stores' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-800">Admin dashboard</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-800">
              {stats ? c.value ?? 0 : error ? '—' : '…'}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to="/admin/users/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 hover:shadow"
        >
          Add user
        </Link>
        <Link
          to="/admin/stores/new"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          Add store
        </Link>
      </div>
    </div>
  )
}