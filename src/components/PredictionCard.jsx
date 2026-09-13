function confidenceLabel(confidence) {
  if (confidence >= 0.9) {
    return 'High model confidence'
  }

  if (confidence >= 0.7) {
    return 'Moderate model confidence'
  }

  return 'Lower model confidence'
}

export function PredictionCard({ prediction, index }) {
  const confidence = prediction.confidence

  return (
    <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-28px_rgba(2,6,23,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Prediction {index + 1}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{prediction.disease}</h3>
        </div>
        <div className="rounded-full bg-[linear-gradient(135deg,#07111f_0%,#0ea5e9_100%)] px-3 py-1 text-sm font-semibold text-white shadow-[0_12px_25px_-16px_rgba(2,132,199,0.8)]">{(confidence * 100).toFixed(1)}%</div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#0284c7_100%)] transition-all duration-700" style={{ width: `${Math.min(confidence * 100, 100)}%` }} />
      </div>

      <p className="mt-3 text-sm text-slate-600">{confidenceLabel(confidence)}</p>
    </div>
  )
}