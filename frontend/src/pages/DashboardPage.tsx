import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Leaf, Activity, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { reportsApi, outbreaksApi } from '../api/client'
import type { Report, Outbreak } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([reportsApi.list(), outbreaksApi.list()])
      .then(([r, o]) => {
        setReports(r.data.results || r.data)
        setOutbreaks(o.data.results || o.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: reports.length,
    completed: reports.filter((r) => r.status === 'completed').length,
    processing: reports.filter((r) => ['pending', 'processing'].includes(r.status)).length,
    activeOutbreaks: outbreaks.length,
  }

  const avgConfidence = (() => {
    const done = reports.filter((r) => r.confidence !== null)
    if (!done.length) return 0
    return Math.round((done.reduce((s, r) => s + (r.confidence || 0), 0) / done.length) * 100)
  })()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Reports', value: stats.total, icon: Leaf, color: 'emerald' as const },
    { label: 'Analyzed', value: stats.completed, icon: CheckCircle2, color: 'sky' as const },
    { label: 'In Progress', value: stats.processing, icon: Activity, color: 'amber' as const },
    { label: 'Active Outbreaks', value: stats.activeOutbreaks, icon: AlertTriangle, color: 'rose' as const },
  ]

  const colorMap = {
    emerald: 'bg-brand-50 text-brand-700 border-brand-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <div>
      <div className="gradient-hero rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, white 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm opacity-90 mb-1">Welcome back,</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.username} 👋</h1>
            <p className="opacity-90 max-w-xl">
              Here's what's happening with your crops and nearby outbreak alerts.
            </p>
          </div>
          <Link
            to="/upload"
            className="bg-white text-brand-700 font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[s.color]}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.completed > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              <span className="font-semibold text-slate-900">Average AI Confidence</span>
            </div>
            <span className="text-2xl font-bold text-brand-700">{avgConfidence}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full gradient-hero rounded-full transition-all duration-500"
              style={{ width: `${avgConfidence}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Recent Reports</h2>
        <Link to="/upload" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          + Add new
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 mx-auto mb-4 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No reports yet</h3>
          <p className="text-slate-500 mb-6">Upload your first crop image to get instant AI analysis</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 gradient-hero text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-brand-500/30"
          >
            <Plus className="w-5 h-5" />
            Create first report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.slice(0, 6).map((r) => (
            <Link
              key={r.id}
              to={`/reports/${r.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover"
            >
              <div className="aspect-video bg-gradient-to-br from-brand-50 to-brand-100 relative">
                <img
                  src={r.image}
                  alt={r.crop_name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  r.status === 'completed' ? 'bg-brand-100 text-brand-700' :
                  r.status === 'failed' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {r.status}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-slate-900">{r.crop_name}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-slate-600 line-clamp-1">
                  {r.detected_disease || 'Analyzing...'}
                </div>
                {r.confidence !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-hero"
                        style={{ width: `${r.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-brand-700">
                      {Math.round(r.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}