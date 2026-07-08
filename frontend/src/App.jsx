import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GuestProvider } from './components/auth/GuestMode'
import { LanguageProvider } from './context/LanguageContext'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Commodity from './pages/Commodity.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <GuestProvider>
        <BrowserRouter>
          <Routes>
            {/* Public - accessible to everyone including guests */}
            <Route path="/"          element={<LandingPage />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/commodity" element={<Commodity />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected - requires login */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GuestProvider>
    </LanguageProvider>
  )
}
