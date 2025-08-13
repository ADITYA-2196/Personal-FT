import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
