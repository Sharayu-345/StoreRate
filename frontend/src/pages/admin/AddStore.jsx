import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { validateStoreName, validateEmail, validateAddress } from '../../utils/validation'

export default function AddStore() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [owners, setOwners] = useState([])
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadOwners() {
      const { data } = await api.get('/admin/users', { params: { role: 'owner' } })
      setOwners(data)
    }
    loadOwners()
  }, [])

  function validate() {
    const errs = {
      name: validateStoreName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    }
    setErrors(errs)
    return Object.values(errs).every((v) => !v)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/admin/stores', form)
      navigate('/admin/stores')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create store')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-800">Add store</h1>

      {serverError && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Store name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Address</label>
          <textarea
            rows={3}
            maxLength={400}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Store owner</label>
          <select
            value={form.ownerId}
            onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">No owner assigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create store'}
        </button>
      </form>
    </div>
  )
}