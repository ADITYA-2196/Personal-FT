import React, { Suspense, useMemo } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'

const Login = React.lazy(() => import('./pages/Login.jsx'))
const Register = React.lazy(() => import('./pages/Register.jsx'))
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'))
const Transactions = React.lazy(() => import('./pages/Transactions.jsx'))
const Users = React.lazy(() => import('./pages/Users.jsx'))

function Nav() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  return (
    <header className="container">
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <Link to="/" className="badge">PFT</Link>
        <nav className="nav">
          {user && (<>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            {user.role === 'admin' && <Link to="/users">Users</Link>}
          </>)}
        </nav>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button className="btn" onClick={toggle}>Theme: {theme}</button>
        {user ? (<>
          <span className="badge">{user.email} ({user.role})</span>
          <button className="btn" onClick={logout}>Logout</button>
        </>) : (
          <Link to="/login" className="btn">Login</Link>
        )}
      </div>
    </header>
  )
}

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Nav />
        <div className="container">
          <Suspense fallback={<div className="card">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
              <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
              <Route path="/users" element={<Protected><Users /></Protected>} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
