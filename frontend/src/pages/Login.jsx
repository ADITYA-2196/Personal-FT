import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(form.email, form.password)
      nav('/dashboard')
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card" style={{maxWidth:460, margin:'2rem auto'}}>
      <h2>Login</h2>
      <p className="badge">Demo: admin@pft.dev, user@pft.dev, viewer@pft.dev / password123</p>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label>Password</label>
        <input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        {error && <div style={{color:'var(--danger)', marginTop:8}}>{error}</div>}
        <div style={{marginTop:12, display:'flex', gap:8}}>
          <button className="btn">Login</button>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </form>
    </div>
  )
}
