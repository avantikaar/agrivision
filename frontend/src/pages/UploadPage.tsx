import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Camera, MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { reportsApi } from '../api/client'

export default function UploadPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [cropName, setCropName] = useState('Tomato')
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 })
  const [locating, setLocating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setFile(f)
    setError('')
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const detectLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const submit = async () => {
    if (!file) {
      setError('Please select an image first')
      return
    }
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('image', file)
      form.append('crop_name', cropName)
      form.append('latitude', String(coords.lat))
      form.append('longitude', String(coords.lng))
      const res = await reportsApi.upload(form)
      navigate(`/reports/${res.data.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">New Crop Report</h1>
        <p className="text-slate-500">Upload a leaf image and get instant AI-powered disease detection</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-rose-700">{error}</div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        {/* Upload area */}
        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const f = e.dataTransfer.files[0]
              if (f) handleFile(f)
            }}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition"
          >
            <div className="w-20 h-20 rounded-2xl gradient-hero mx-auto mb-5 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Click to upload or drag &amp; drop
            </h3>
            <p className="text-sm text-slate-500 mb-1">JPG, PNG, or JPEG · Max 10MB</p>
            <p className="text-xs text-slate-400">Best results: clear close-up of a single leaf</p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden">
            <img src={preview} alt="preview" className="w-full max-h-96 object-contain bg-slate-50" />
            <button
              onClick={() => { setFile(null); setPreview('') }}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition"
            >
              Change image
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* Crop selection */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Crop type</label>
          <div className="grid grid-cols-4 gap-2">
            {['Tomato', 'Potato', 'Pepper', 'Other'].map((c) => (
              <button
                key={c}
                onClick={() => setCropName(c)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  cropName === c
                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 font-mono">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </div>
            <button
              onClick={detectLocation}
              disabled={locating}
              className="px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-60"
            >
              <MapPin className="w-4 h-4" />
              {locating ? 'Locating...' : 'Use my location'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!file || uploading}
          className="mt-8 w-full gradient-hero text-white font-semibold py-4 rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Analyze with AI
            </>
          )}
        </button>

        {/* Info box */}
        <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-brand-900">
            <strong>What happens next:</strong> Your image is queued for AI analysis. Results usually
            appear within 10–15 seconds. You'll be redirected to the report page automatically.
          </div>
        </div>
      </div>
    </div>
  )
}