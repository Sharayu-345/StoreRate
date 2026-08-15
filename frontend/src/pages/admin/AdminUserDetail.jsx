import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import StarRating from '../../components/StarRating'

export default function AdminUserDetail() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get(`/admin/users/${id}`)
        setDetail(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-8 text-slate-400">Loading...</div>
  if (!detail) return <div className="mx-auto max-w-2xl px-4 py-8 text-slate-400">User not found</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/admin/users" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
        ← Back to users
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="mb-4 text-xl font-semibold text-slate-800">{detail.name}</h1>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-400">Email</dt>
            <dd className="text-slate-700">{detail.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-400">Role</dt>
            <dd className="capitalize text-slate-700">{detail.role}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-slate-400">Address</dt>
            <dd className="text-slate-700">{detail.address}</dd>
          </div>
          {detail.role === 'owner' && (
            <div>
              <dt className="text-xs uppercase text-slate-400">Store rating</dt>
              <dd className="mt-1 flex items-center gap-2">
                <StarRating value={detail.average_rating || 0} readOnly size="text-sm" />
                <span className="text-xs text-slate-400">
                  ({detail.average_rating ? Number(detail.average_rating).toFixed(1) : '—'})
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}