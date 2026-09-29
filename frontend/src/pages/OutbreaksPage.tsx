import { useEffect, useState } from 'react'
import { AlertTriangle, MapPin, TrendingUp, ShieldAlert, Info } from 'lucide-react'
import { outbreaksApi } from '../api/client'
import type { Outbreak } from '../api/client'
export default function OutbreaksPage() {
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    outbreaksApi.list()
      .then((r) => setOutbreaks(r.data.results || r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalReports = outbreaks.reduce((s, o) => s + o.report_count, 0)
  const districts = new Set(outbreaks.map((o) => o.district)).size

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Regional Outbreaks</h1>
            <p className="text-slate-500">Active disease warnings across districts</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="text-sm text-slate-500">Active Alerts</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{outbreaks.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-500">Total Reports</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalReports}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-sky-500" />
            <span className="text-sm text-slate-500">Districts</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{districts}</div>
        </div>
      </div>

      {/* List */}
      {outbreaks.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 mx-auto mb-4 flex items-center justify-center">
            <Info className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No active outbreaks</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Good news! When 3 or more reports of the same disease appear in a district within 7 days,
            an outbreak alert will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {outbreaks.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 p-6 card-hover"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                      Active Outbreak
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{o.disease}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {o.district}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      {o.report_count} reports in 7 days
                    </span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-rose-500">
                  {o.report_count}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-slate-700 text-sm">
                {o.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="mt-8 bg-gradient-to-br from-sky-50 to-white border border-sky-200 rounded-2xl p-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-sky-900">
          <strong>How outbreak detection works:</strong> Our system monitors all crop reports in real-time.
          When 3 or more farmers in the same district report the same disease within 7 days, we flag an
          outbreak and notify nearby farmers so they can take preventive action before it spreads.
        </div>
      </div>
    </div>
  )
}