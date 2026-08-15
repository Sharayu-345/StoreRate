import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Signup from './pages/Signup'
import UpdatePassword from './pages/UpdatePassword'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminStores from './pages/admin/AdminStores'
import AddUser from './pages/admin/AddUser'
import AddStore from './pages/admin/AddStore'

import StoreList from './pages/user/StoreList'
import OwnerDashboard from './pages/owner/OwnerDashboard'

export default function App() {
  const { user } = useAuth()
  const location = useLocation()
  const homeByRole = { admin: '/admin', user: '/stores', owner: '/owner' }

  // Login/signup are full-screen pages with their own branding — no app navbar there.
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={isAuthRoute ? '' : 'min-h-screen bg-slate-50'}>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={user ? homeByRole[user.role] : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/update-password"
          element={
            <ProtectedRoute roles={['user', 'owner']}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stores"
          element={
            <ProtectedRoute roles={['user']}>
              <StoreList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute roles={['admin']}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminStores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores/new"
          element={
            <ProtectedRoute roles={['admin']}>
              <AddStore />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}