import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validation'

export default function AddUser() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
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
      await api.post('/admin/users', form)
      navigate('/admin/users')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-800">Add user</h1>

      {serverError && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Field label="Name" hint="20-60 characters" value={form.name} error={errors.name}
          onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Email" type="email" value={form.email} error={errors.email}
          onChange={(v) => setForm({ ...form, email: v })} />
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
        <Field label="Password" type="password" hint="8-16 chars, 1 uppercase, 1 special character"
          value={form.password} error={errors.password} onChange={(v) => setForm({ ...form, password: v })} />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="user">Normal user</option>
            <option value="admin">Admin</option>
            <option value="owner">Store owner</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create user'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, hint, type = 'text', value, error, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}