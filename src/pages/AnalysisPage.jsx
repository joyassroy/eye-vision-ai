import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Settings, Activity, Upload, Brain, ScanSearch, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { AnalysisButton } from '../components/AnalysisButton.jsx'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'
import { ImagePreview } from '../components/ImagePreview.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { UploadDropzone } from '../components/UploadDropzone.jsx'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { predictImage } from '../services/api.js'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp'

function validateFile(file) {
  if (!file) {
    return 'Please select an image before analyzing.'
  }

  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Please choose an image smaller than 10 MB.'
  }

  return ''
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const {
    currentFile,
    currentPreviewUrl,
    currentFileName,
    setCurrentImage,
    clearCurrentImage,
    analysisThreshold,
    setAnalysisThreshold,
    loading,
    setLoading,
    setAnalysisResult,
    backendStatus,
  } = useAnalysis()

  const [localError, setLocalError] = useState('')

  async function handleAnalyze() {
    const validationError = validateFile(currentFile)
    if (validationError) {
      setLocalError(validationError)
      return
    }

    if (backendStatus === 'offline') {
      setLocalError('Unable to connect to the AI analysis server. Please make sure the backend is running.')
      return
    }

    setLocalError('')
    setLoading(true)

    try {
      const result = await predictImage(currentFile, analysisThreshold)
      setAnalysisResult(result)
      navigate('/results')
    } catch (error) {
      setLocalError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-shell space-y-12">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.18)] fade-up">
        <div className="hero-gradient relative px-8 py-16 md:px-14 md:py-20">
          <div className="absolute inset-0 subtle-grid opacity-[0.06]" />
          <div className="ambient-orb left-8 top-8 h-40 w-40 bg-violet-500/15" />
          <div className="ambient-orb delay bottom-4 right-8 h-48 w-48 bg-cyan-400/10" />

          <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 backdrop-blur-md">
              <ScanSearch className="h-4 w-4 text-cyan-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Live AI Inference</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl xl:text-5xl">
              Run Intelligent Analysis on{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                Slit-Lamp Images
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Upload a high-resolution anterior segment image. Our <span className="font-semibold text-white">EfficientNet-V2-M</span> model will simultaneously predict 15 ocular conditions and generate a <span className="font-semibold text-cyan-300">Grad-CAM</span> explanation.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ MAIN WORKSPACE ═══════════════ */}
      <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr]">
        
        {/* Left Column: Upload & Controls */}
        <div className="space-y-6 fade-up" style={{ animationDelay: '100ms' }}>
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur sm:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-cyan-400/10 blur-3xl" />
            
            <div className="relative space-y-8">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Upload Image</h2>
                  <p className="text-xs text-slate-500">Provide a clear slit-lamp photograph</p>
                </div>
              </div>

              {/* Dropzone */}
              <UploadDropzone
                accept={ACCEPTED_EXTENSIONS}
                error={localError}
                onFileSelected={(file) => {
                  const validationError = validateFile(file)
                  if (validationError) {
                    setLocalError(validationError)
                    return
                  }
                  setLocalError('')
                  setCurrentImage(file)
                }}
              />

              {/* Threshold Slider */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition-colors hover:bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800" htmlFor="threshold-slider">
                    <SlidersHorizontal className="h-4 w-4 text-cyan-600" />
                    Prediction Threshold
                  </label>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-cyan-700 shadow-sm border border-slate-100">
                    {(analysisThreshold * 100).toFixed(0)}%
                  </span>
                </div>
                
                <input
                  id="threshold-slider"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={analysisThreshold}
                  onChange={(event) => setAnalysisThreshold(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                />
                
                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>High Recall</span>
                  <span>Balanced (50%)</span>
                  <span>High Precision</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <AnalysisButton loading={loading} onClick={handleAnalyze} className="sm:flex-1">
                  Run AI Analysis
                  <ChevronRight className="ml-1 h-4 w-4" />
                </AnalysisButton>
                
                <button
                  type="button"
                  onClick={() => {
                    clearCurrentImage()
                    setLocalError('')
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-slate-600"
                  disabled={loading || !currentFile}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <DisclaimerBanner />
        </div>

        {/* Right Column: Preview & Workflow */}
        <div className="space-y-6 fade-up" style={{ animationDelay: '200ms' }}>
          
          {loading ? (
            <LoadingState />
          ) : (
            <ImagePreview 
              imageUrl={currentPreviewUrl} 
              fileName={currentFileName} 
              onRemove={() => {
                clearCurrentImage()
                setLocalError('')
              }} 
            />
          )}

          {/* Workflow guide */}
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Analysis Workflow</h3>
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
              {[
                { title: 'Upload Image', desc: 'Select a clear slit-lamp photograph from your device.' },
                { title: 'Adjust Threshold', desc: 'Set the confidence threshold for multi-label predictions.' },
                { title: 'Cloud Inference', desc: 'The EfficientNet-V2-M model processes the image via FastAPI.' },
                { title: 'Review Results', desc: 'Examine the Grad-CAM heatmaps and probability scores.' },
              ].map((step, i) => (
                <div key={i} className="relative flex gap-4 pl-8">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-black text-slate-600 shadow-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}