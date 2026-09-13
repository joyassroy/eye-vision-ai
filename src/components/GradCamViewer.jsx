import { Download, Image as ImageIcon, Layers3, RotateCw } from 'lucide-react'

const viewOptions = [
  { key: 'original', label: 'Original' },
  { key: 'gradcam', label: 'Grad-CAM' },
  { key: 'overlay', label: 'Overlay' },
]

export function GradCamViewer({
  originalUrl,
  gradcamUrl,
  overlayUrl,
  selectedView,
  onViewChange,
  targetClass,
  detectedClasses,
  onTargetClassChange,
  onRefreshGradcam,
  canRefresh,
  explanation,
  onDownload,
}) {
  const visualUrl =
    selectedView === 'original' ? originalUrl : selectedView === 'gradcam' ? gradcamUrl : overlayUrl || gradcamUrl

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 px-6 py-5">
        <div>
          <h3 className="card-title">AI Attention Map</h3>
          <p className="mt-2 text-sm text-slate-600">Highlighted regions represent areas that contributed to the model's prediction. Grad-CAM is an interpretability technique and should not be interpreted as a clinical lesion boundary.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onViewChange(option.key)}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                selectedView === option.key ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <Download className="h-4 w-4" />
              Download Grad-CAM
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ImageIcon className="h-4 w-4" />
            {selectedView === 'original' ? 'Original image' : 'Original image reference'}
          </div>
          {originalUrl ? <img src={originalUrl} alt="Original uploaded slit-lamp image" className="h-[26rem] w-full rounded-2xl object-contain bg-white" /> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Layers3 className="h-4 w-4" />
              {selectedView === 'original' ? 'Original image' : selectedView === 'gradcam' ? 'Grad-CAM heatmap' : 'Overlay visualization'}
            </div>
            {selectedView !== 'original' && canRefresh ? (
              <button
                type="button"
                onClick={onRefreshGradcam}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            ) : null}
          </div>

          {visualUrl ? (
            <img
              src={visualUrl}
              alt={selectedView === 'gradcam' ? 'Grad-CAM heatmap' : selectedView === 'overlay' ? 'Overlay explanation image' : 'Original image'}
              className="h-[26rem] w-full rounded-2xl object-contain bg-white"
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 border-t border-slate-200/80 px-6 py-5 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2">
          <label htmlFor="target-class" className="text-sm font-semibold text-slate-900">
            Explain prediction for:
          </label>
          <select
            id="target-class"
            value={targetClass}
            onChange={(event) => onTargetClassChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {detectedClasses.length > 0 ? null : <option value={targetClass}>{targetClass}</option>}
            {detectedClasses.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-200">
          <p className="font-semibold text-white">Interpretation note</p>
          <p className="mt-2">{explanation}</p>
        </div>
      </div>
    </div>
  )
}