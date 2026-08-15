import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import StarRating from '../../components/StarRating'
import SortableTable from '../../components/SortableTable'

export default function OwnerDashboard() {
  const [data, setData] = useState({ average_rating: 0, raters: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/owner/dashboard')
        setData(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const averageRating = data.average_rating ? Number(data.average_rating) : 0
  const raters = data.raters || []
  const totalRatings = raters.length

  // count of raters per star value, for the little breakdown bars
  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    raters.forEach((r) => {
      const rounded = Math.round(Number(r.rating))
      if (counts[rounded] !== undefined) counts[rounded] += 1
    })
    return counts
  }, [raters])

  const columns = [
    { key: 'user_name', label: 'Name', sortable: true },
    { key: 'user_email', label: 'Email', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => <StarRating value={row.rating} readOnly size="text-sm" />,
    },
    {
      key: 'created_at',
      label: 'Rated on',
      sortable: true,
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : '—',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Store dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's how customers have been rating your store.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Average rating card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Average rating</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-semibold text-slate-800">
                  {averageRating ? averageRating.toFixed(1) : '—'}
                </span>
                <span className="mb-1">
                  <StarRating value={averageRating} readOnly size="text-sm" />
                </span>
              </div>
            </div>

            {/* Total ratings card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total ratings</p>
              <p className="mt-1 text-3xl font-semibold text-slate-800">{totalRatings}</p>
            </div>

            {/* Breakdown card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-sm font-medium text-slate-500">Rating breakdown</p>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star]
                  const pct = totalRatings ? Math.round((count / totalRatings) * 100) : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-2">{star}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-5 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <h2 className="mb-3 mt-8 text-sm font-medium text-slate-600">
            Users who rated your store
          </h2>
          <SortableTable columns={columns} rows={raters} emptyMessage="No ratings yet" />
        </>
      )}
    </div>
  )
}