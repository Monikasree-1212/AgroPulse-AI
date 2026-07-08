import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import useTranslation from '../../hooks/useTranslation'

const GuestContext = createContext(null)

export function GuestProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [checked, setChecked] = useState(false)
  const { setLanguage } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('agropulse_token')
    const stored = localStorage.getItem('agropulse_user')
    if (token && stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        if (parsed.preferredLanguage) setLanguage(parsed.preferredLanguage, { sync: false })
      } catch {}
    }
    setChecked(true)
  }, [setLanguage])

  const login = useCallback((token, userData) => {
    localStorage.setItem('agropulse_token', token)
    localStorage.setItem('agropulse_user',  JSON.stringify(userData))
    if (userData.primaryCrop) localStorage.setItem('commodity', userData.primaryCrop)
    if (userData.preferredLanguage) setLanguage(userData.preferredLanguage, { sync: false })
    setUser(userData)
  }, [setLanguage])

  const logout = useCallback(() => {
    localStorage.removeItem('agropulse_token')
    localStorage.removeItem('agropulse_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    localStorage.setItem('agropulse_user', JSON.stringify(userData))
    if (userData.primaryCrop) localStorage.setItem('commodity', userData.primaryCrop)
    if (userData.preferredLanguage) setLanguage(userData.preferredLanguage, { sync: false })
    setUser(userData)
  }, [setLanguage])

  const continueAsGuest = useCallback(() => {
    localStorage.setItem('agropulse_guest', 'true')
  }, [])

  const isLoggedIn = !!user
  const isGuest    = !isLoggedIn

  return (
    <GuestContext.Provider value={{ user, isLoggedIn, isGuest, login, logout, updateUser, continueAsGuest, checked }}>
      {checked ? children : null}
    </GuestContext.Provider>
  )
}

export function useGuest() {
  const ctx = useContext(GuestContext)
  if (!ctx) throw new Error('useGuest must be used inside GuestProvider')
  return ctx
}




