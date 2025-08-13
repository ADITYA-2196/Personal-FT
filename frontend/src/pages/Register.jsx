import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email: '', password: '' })
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await register(form)
      nav('/dashboard')
    } catch (e) {
      setError(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="card" style={{maxWidth:460, margin:'2rem auto'}}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <label>Email</label>
        <input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label>Password</label>
        <input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        {error && <div style={{color:'var(--danger)', marginTop:8}}>{error}</div>}
        <div style={{marginTop:12, display:'flex', gap:8}}>
          <button className="btn">Create account</button>
        </div>
      </form>
    </div>
  )
}
