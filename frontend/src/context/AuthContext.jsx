import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import axios from 'axios'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const api = useMemo(() => {
    const inst = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return inst
  }, [token])

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:4000/api') + '/auth/login', { email, password })
    setToken(data.token); setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:4000/api') + '/auth/register', payload)
    setToken(data.token); setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }, [])

  const logout = useCallback(() => {
    setToken(null); setUser(null)
    localStorage.removeItem('token'); localStorage.removeItem('user')
  }, [])

  const value = useMemo(() => ({ token, user, api, login, register, logout }), [token, user, api, login, register, logout])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
