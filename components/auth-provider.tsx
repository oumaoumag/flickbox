"use client"

import React, { createContext, useContext, useState } from "react"

interface AuthContextType {
  user: null | { id: string; name: string }
  login: (user: { id: string; name: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | { id: string; name: string }>(null)

  const login = (userData: { id: string; name: string }) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
