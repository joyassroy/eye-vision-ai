export function ProbabilityTable({ classes, probabilities, threshold }) {
  const rows = classes
    .map((disease) => ({ disease, probability: probabilities?.[disease] ?? 0 }))
    .sort((left, right) => right.probability - left.probability)

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(224,242,254,0.76))] px-6 py-5">
        <h3 className="card-title">All Model Predictions</h3>
        <p className="mt-2 text-sm text-slate-600">Sorted by probability. Status reflects the configured threshold of {(threshold * 100).toFixed(0)}%.</p>
      </div>

      <div className="divide-y divide-slate-200/80">
        {rows.map((row) => {
          const detected = row.probability >= threshold
          return (
            <div key={row.disease} className="grid gap-4 px-6 py-4 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_140px] md:items-center">
              <div>
                <p className="font-semibold text-slate-950">{row.disease}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#0284c7_100%)]" style={{ width: `${Math.min(row.probability * 100, 100)}%` }} />
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-700">{(row.probability * 100).toFixed(1)}%</div>
              <div>
                <span className={['inline-flex rounded-full px-3 py-1 text-xs font-semibold', detected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'].join(' ')}>
                  {detected ? 'Detected' : 'Not detected'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}