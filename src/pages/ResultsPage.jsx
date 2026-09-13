import { Download, FileJson, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'
import { GradCamViewer } from '../components/GradCamViewer.jsx'
import { PredictionCard } from '../components/PredictionCard.jsx'
import { PredictionSummary } from '../components/PredictionSummary.jsx'
import { ProbabilityTable } from '../components/ProbabilityTable.jsx'
import { downloadRemoteFile, predictImage, resolveBackendUrl } from '../services/api.js'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { MODEL_REPORT } from '../constants/modelReport.js'

export function ResultsPage() {
  const navigate = useNavigate()
  const {
    analysisResult,
    currentFile,
    currentPreviewUrl,
    classes,
    analysisThreshold,
    setAnalysisResult,
    backendStatus,
  } = useAnalysis()
  const [selectedView, setSelectedView] = useState('overlay')
  const [targetClass, setTargetClass] = useState(analysisResult?.target_class || analysisResult?.top_prediction || '')
  const [refreshing, setRefreshing] = useState(false)

  const detectedClasses = useMemo(() => (analysisResult?.predictions || []).map((item) => item.disease), [analysisResult])
  const isNormal = detectedClasses.length === 1 && detectedClasses[0] === 'Normal'

  useEffect(() => {
    setTargetClass(analysisResult?.target_class || analysisResult?.top_prediction || '')
  }, [analysisResult])

  if (!analysisResult) {
    return (
      <div className="section-shell">
        <div className="glass-panel p-8 text-center">
          <p className="muted-label">Results</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">No analysis result available</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Run an image analysis first to view the model prediction, Grad-CAM attention map, and all class probabilities.
          </p>
          <div className="mt-6">
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to Analysis
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function refreshGradcam(nextTargetClass = targetClass) {
    if (!currentFile) {
      return
    }

    setRefreshing(true)
    try {
      const updated = await predictImage(currentFile, analysisThreshold, nextTargetClass)
      setAnalysisResult(updated)
    } finally {
      setRefreshing(false)
    }
  }

  async function handleDownloadGradcam() {
    const downloadUrl = selectedView === 'overlay' && analysisResult.overlay_url ? analysisResult.overlay_url : analysisResult.gradcam_url
    await downloadRemoteFile(resolveBackendUrl(downloadUrl), `${analysisResult.filename}-${selectedView}-visualization.png`)
  }

  function downloadAnalysisJson() {
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' })
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = `${analysisResult.filename}-analysis.json`
    anchor.click()
    URL.revokeObjectURL(objectUrl)
  }

  return (
    <div className="section-shell space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur fade-up">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-cyan-200/30 to-transparent blur-3xl" />
        
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-600">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
              Analysis Complete
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              AI Diagnostic <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Results</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              This dashboard summarizes the model prediction, confidence values, Grad-CAM visualization, and the full probability distribution across all 15 classes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/analysis')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Another Image
            </button>
            <button
              type="button"
              onClick={handleDownloadGradcam}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-6px_rgba(6,182,212,0.6)]"
            >
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Download className="h-4 w-4" />
              Download Grad-CAM
            </button>
            <button
              type="button"
              onClick={downloadAnalysisJson}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              <FileJson className="h-4 w-4 text-slate-300" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 fade-up" style={{ animationDelay: '100ms' }}>
        <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600">Architecture</span>
          <span className="mt-1 block text-lg font-extrabold text-slate-900">{MODEL_REPORT.architecture}</span>
        </div>
        <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Threshold</span>
          <span className="mt-1 block text-lg font-extrabold text-slate-900">{(analysisThreshold * 100).toFixed(0)}%</span>
        </div>
        <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">Validation accuracy</span>
          <span className="mt-1 block text-lg font-extrabold text-slate-900">96.6%</span>
        </div>
        <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Processing time</span>
          <span className="mt-1 block text-lg font-extrabold text-slate-900">{analysisResult.processing_time_ms} ms</span>
        </div>
      </div>

      <PredictionSummary result={analysisResult} isNormal={isNormal} />

      {analysisResult.predictions?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {analysisResult.predictions.map((prediction, index) => (
            <PredictionCard key={prediction.disease} prediction={prediction} index={index} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-6 text-sm text-slate-600">
          No diseases exceeded the configured threshold. The top class is still shown above for research review.
        </div>
      )}

      <GradCamViewer
        originalUrl={currentPreviewUrl}
        gradcamUrl={resolveBackendUrl(analysisResult.gradcam_url)}
        overlayUrl={resolveBackendUrl(analysisResult.overlay_url || analysisResult.gradcam_url)}
        selectedView={selectedView}
        onViewChange={setSelectedView}
        targetClass={targetClass}
        detectedClasses={detectedClasses.length > 1 ? detectedClasses : classes.filter((label) => label === analysisResult.top_prediction || label === analysisResult.target_class)}
        onTargetClassChange={(value) => {
          setTargetClass(value)
          if (backendStatus !== 'offline') {
            refreshGradcam(value)
          }
        }}
        onRefreshGradcam={() => refreshGradcam(targetClass)}
        canRefresh={Boolean(currentFile) && !refreshing}
        explanation="Highlighted regions represent areas that contributed to the model's prediction. Grad-CAM is an interpretability technique and should not be interpreted as a clinical lesion boundary."
        onDownload={handleDownloadGradcam}
      />

      <ProbabilityTable classes={classes} probabilities={analysisResult.all_probabilities} threshold={analysisResult.threshold} />

      <DisclaimerBanner />
    </div>
  )
}