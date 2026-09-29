import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  username: string
  email: string
  role: 'farmer' | 'admin'
  preferred_language: string
  district: string
  latitude: number | null
  longitude: number | null
}

export interface Report {
  id: number
  farmer: number
  farmer_username: string
  image: string
  crop_name: string
  latitude: number
  longitude: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  detected_disease: string
  confidence: number | null
  treatment_plan: string
  created_at: string
  processed_at: string | null
}

export interface Outbreak {
  id: number
  disease: string
  district: string
  report_count: number
  message: string
  is_active: boolean
  created_at: string
}

export const authApi = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (username: string, password: string) => api.post('/auth/login/', { username, password }),
  me: () => api.get<User>('/auth/me/'),
}

export const reportsApi = {
  list: () => api.get('/reports/'),
  get: (id: number) => api.get<Report>(`/reports/${id}/`),
  upload: (formData: FormData) =>
    api.post('/reports/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const outbreaksApi = {
  list: () => api.get('/outbreaks/'),
}