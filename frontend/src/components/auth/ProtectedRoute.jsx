import { Navigate, useLocation } from 'react-router-dom'
import { useGuest } from './GuestMode'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useGuest()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
