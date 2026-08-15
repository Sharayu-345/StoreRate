import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'Normal user' },
  { value: 'owner', label: 'Store owner' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)

      if (user.role !== role) {
        setError(`This account is registered as "${user.role}", not "${role}". Select the correct tab.`)
        setLoading(false)
        return
      }

      const homeByRole = { admin: '/admin', user: '/stores', owner: '/owner' }
      navigate(homeByRole[user.role] || '/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Log in" subtitle="Choose your role, then enter your details">
      <div className="mb-6 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={`rounded-md px-2 py-2 text-xs font-medium transition sm:text-sm ${
              role === r.value
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : `Log in as ${ROLES.find((r) => r.value === role).label}`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}