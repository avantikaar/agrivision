import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Activity, Leaf, Stethoscope, Shield, Loader2 } from 'lucide-react'
import { reportsApi } from '../api/client'
import type { Report } from '../api/client'
export default function ReportDetailPage() {
  const { id } = useParams()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let interval: any
    const fetchReport = () => {
      reportsApi.get(Number(id))
        .then((r) => {
          setReport(r.data)
          setLoading(false)
          if (['pending', 'processing'].includes(r.data.status)) {
            interval = setTimeout(fetchReport, 2000)
          }
        })
        .catch(() => setLoading(false))
    }
    fetchReport()
    return () => clearTimeout(interval)
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-24">
        <div className="text-slate-500 mb-4">Report not found</div>
        <Link to="/dashboard" className="text-brand-600 font-semibold">← Back to dashboard</Link>
      </div>
    )
  }

  const isProcessing = ['pending', 'processing'].includes(report.status)
  const isCompleted = report.status === 'completed'
  const isFailed = report.status === 'failed'

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — image */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-square bg-gradient-to-br from-brand-50 to-brand-100">
              <img
                src={report.image}
                alt={report.crop_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 space-y-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 font-mono">
                  {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">
                  {new Date(report.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Leaf className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{report.crop_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status card */}
          <div className={`rounded-2xl p-6 border ${
            isCompleted ? 'bg-gradient-to-br from-brand-50 to-white border-brand-200' :
            isFailed ? 'bg-rose-50 border-rose-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {isProcessing && <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />}
              <div className={`text-sm font-semibold uppercase tracking-wider ${
                isCompleted ? 'text-brand-700' :
                isFailed ? 'text-rose-700' :
                'text-amber-700'
              }`}>
                {isCompleted ? 'Analysis Complete' : isFailed ? 'Analysis Failed' : 'Analyzing...'}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isCompleted ? report.detected_disease : isProcessing ? 'Processing image' : 'Try again'}
            </h1>
            {report.confidence !== null && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full gradient-hero"
                    style={{ width: `${report.confidence * 100}%` }}
                  />
                </div>
                <div className="text-2xl font-bold text-brand-700">
                  {Math.round(report.confidence * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Treatment plan */}
          {isCompleted && report.treatment_plan && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-brand-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">AI Treatment Plan</h2>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {report.treatment_plan}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong>Note:</strong> AI recommendations are guidance, not a replacement for a
                  certified agronomist. For severe cases, consult your local agriculture officer.
                </div>
              </div>
            </>
          )}

          {isProcessing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900">AI Pipeline Running</h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Image uploaded and queued
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  Gemini Vision analyzing leaf pattern...
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Generating treatment plan
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Checking for regional outbreaks
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">Page will auto-refresh when ready</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}