export function ModelArchitecture({ classes = [] }) {
  const steps = [
    'Input Image',
    'Preprocessing',
    'EfficientNet-V2-M',
    'Feature Extraction',
    'Classifier',
    '15 Disease Probabilities',
    'Grad-CAM Explanation',
  ]

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <h3 className="card-title">Model Architecture</h3>
        <p className="mt-2 text-sm text-slate-600">EfficientNet-V2-M is configured for multi-label classification with a sigmoid output layer and explainable AI overlays.</p>
      </div>

      <div className="grid gap-4 p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Input</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">224 × 224 × 3</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Task</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Multi-label classification</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Activation</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Sigmoid</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Output</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">15 classes</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-7">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="flex min-h-20 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-900 shadow-sm">
                {step}
              </div>
              {index < steps.length - 1 ? <div className="hidden h-0.5 w-full bg-slate-200 lg:block" /> : null}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Why multi-label classification?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Slit-lamp images can contain more than one supported anterior-segment condition. A sigmoid-based multi-label head allows the network to assign independent probabilities to each class rather than forcing a single mutually exclusive choice.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Why Grad-CAM?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Grad-CAM provides a localized explanation of which regions influenced the target prediction. This is useful for research inspection, but it is not a lesion boundary or clinical diagnosis.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Detected class vocabulary</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {classes.map((label) => (
              <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}