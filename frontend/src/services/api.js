import axios from 'axios'

// In dev: safely fallback to localhost:5000 if not compiled
// In prod: VITE_API_URL handles the production URL
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000' : '');

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agropulse_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
