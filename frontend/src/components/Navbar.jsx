import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const homeByRole = {
    admin: '/admin',
    user: '/stores',
    owner: '/owner',
  }

  // links shown per role, left side of navbar
  const navLinksByRole = {
    admin: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' },
    ],
    user: [
      { to: '/stores', label: 'Stores' },
    ],
    owner: [
      { to: '/owner', label: 'Dashboard' },
    ],
  }

  const links = user ? navLinksByRole[user.role] || [] : []

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            to={user ? homeByRole[user.role] : '/login'}
            className="flex items-center gap-2 text-lg font-semibold text-brand-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-sm">
              S
            </span>
            StoreRate
          </Link>

          {user && (
            <nav className="flex items-center gap-1 text-sm">
              {links.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={
                      active
                        ? 'rounded-md bg-brand-50 px-3 py-1.5 font-medium text-brand-700 ring-1 ring-inset ring-brand-100'
                        : 'rounded-md px-3 py-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-brand-600'
                    }
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">
              {user.name}{' '}
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-500">
                {user.role}
              </span>
            </span>
            {(user.role === 'user' || user.role === 'owner') && (
              <Link to="/update-password" className="text-slate-600 transition hover:text-brand-600">
                Change password
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-white shadow-sm transition hover:bg-slate-900 hover:shadow"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}