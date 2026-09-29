import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../api/client'
import type { User } from '../api/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.me()
      .then((r) => setUser(r.data))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    const r = await authApi.login(username, password)
    localStorage.setItem('access_token', r.data.access)
    localStorage.setItem('refresh_token', r.data.refresh)
    const me = await authApi.me()
    setUser(me.data)
  }

  const register = async (data: any) => {
    await authApi.register(data)
    await login(data.username, data.password)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}