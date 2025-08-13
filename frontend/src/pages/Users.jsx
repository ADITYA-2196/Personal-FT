import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Users() {
  const { api } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => { (async () => {
    const { data } = await api.get('/users')
    setItems(data)
  })() }, [api])

  return (
    <div className="card">
      <h2>Users (Admin only)</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
        <tbody>
          {items.map(u => <tr key={u.id}>
            <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.created_at).toLocaleString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
