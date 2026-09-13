import { BadgeCheck, Clock3, ShieldAlert } from 'lucide-react'

export function PredictionSummary({ result, isNormal = false }) {
  if (!result) {
    return null
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(224,242,254,0.76))] px-6 py-6">
        <div className="ambient-orb left-[-2rem] top-[-2rem] h-28 w-28 bg-cyan-400/20" />
        <div className="ambient-orb delay right-[-1rem] bottom-[-2rem] h-24 w-24 bg-sky-500/20" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="muted-label">Detected Condition</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{result.top_prediction}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {isNormal
                ? 'Model did not detect any of the supported conditions above the configured threshold.'
                : 'This is an AI-generated model prediction based on the uploaded slit-lamp image.'}
            </p>
          </div>

          <div className="grid min-w-[14rem] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[linear-gradient(135deg,#07111f_0%,#0f2746_55%,#0ea5e9_100%)] p-4 text-white shadow-[0_18px_30px_-18px_rgba(2,132,199,0.75)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
                <BadgeCheck className="h-4 w-4" />
                Model Confidence
              </div>
              <div className="mt-2 text-2xl font-bold">{(result.top_confidence * 100).toFixed(1)}%</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Clock3 className="h-4 w-4" />
                Processing Time
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{result.processing_time_ms} ms</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200/70 px-6 py-5 text-sm text-slate-600">
        <span className="rounded-full bg-sky-50 px-4 py-2 font-medium text-sky-700">Threshold: {(result.threshold * 100).toFixed(0)}%</span>
        <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">{result.predictions?.length || 0} detected condition{result.predictions?.length === 1 ? '' : 's'}</span>
        <span className="rounded-full bg-cyan-50 px-4 py-2 font-medium text-cyan-700">EfficientNet-V2-M</span>
        {isNormal ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 font-medium text-emerald-700">
            <ShieldAlert className="h-4 w-4" />
            Normal result mode
          </span>
        ) : null}
      </div>
    </div>
  )
}