import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import SortableTable from '../../components/SortableTable'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function fetchUsers() {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/users', { params: filters })
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/users/${row.id}`)}
          className="text-brand-600 hover:underline"
        >
          View
        </button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Users</h1>
        <Link
          to="/admin/users/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add user
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          fetchUsers()
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
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal user</option>
          <option value="owner">Store owner</option>
        </select>
        <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900">
          Filter
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : (
        <SortableTable columns={columns} rows={users} />
      )}
    </div>
  )
}