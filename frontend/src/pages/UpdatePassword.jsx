import { useState } from 'react'
import api from '../api/axios'
import { validatePassword } from '../utils/validation'

export default function UpdatePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const pwError = validatePassword(form.newPassword)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)
    try {
      await api.put('/auth/update-password', form)
      setSuccess('Password updated successfully')
      setForm({ oldPassword: '', newPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold text-slate-800">Update password</h1>

      {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Current password</label>
          <input
            type="password"
            required
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">New password</label>
          <input
            type="password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <p className="mt-1 text-xs text-slate-400">8-16 chars, 1 uppercase, 1 special character</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}