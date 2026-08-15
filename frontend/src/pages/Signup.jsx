import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateName, validateEmail, validateAddress, validatePassword } from '../utils/validation'
import AuthLayout from '../components/AuthLayout'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
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
      await signup({ ...form, role: 'user' })
      navigate('/stores')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to start rating stores">
      {serverError && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          label="Full name"
          hint="20-60 characters"
          value={form.name}
          error={errors.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          error={errors.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Address</label>
          <textarea
            rows={3}
            maxLength={400}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          hint="8-16 chars, 1 uppercase, 1 special character"
          value={form.password}
          error={errors.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

function Field({ label, hint, type = 'text', placeholder, value, error, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}