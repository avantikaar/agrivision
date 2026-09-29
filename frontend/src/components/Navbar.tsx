import { Link, useLocation } from 'react-router-dom'
import { Leaf, LayoutDashboard, Upload, AlertTriangle, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'New Report', icon: Upload },
    { to: '/outbreaks', label: 'Outbreaks', icon: AlertTriangle },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg leading-tight">AgriVision</div>
            <div className="text-xs text-slate-500 leading-tight">Crop Intelligence</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(to)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-semibold text-slate-900">{user?.username}</div>
            <div className="text-xs text-slate-500">{user?.district || 'No district'}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}