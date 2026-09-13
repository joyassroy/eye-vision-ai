import { Activity, BrainCircuit, Loader2, Sparkles } from 'lucide-react'

const stages = [
  { label: 'Uploading image...', icon: Activity },
  { label: 'Analyzing image...', icon: BrainCircuit },
  { label: 'Generating explanation...', icon: Sparkles },
]

export function LoadingState() {
  return (
    <div className="glass-panel flex min-h-[22rem] flex-col justify-center overflow-hidden px-6 py-8">
      <div className="relative mb-8 flex items-center gap-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#07111f_0%,#0d2544_50%,#123f6d_100%)] px-5 py-5 text-white">
        <div className="ambient-orb left-[-2rem] top-[-2rem] h-32 w-32 bg-cyan-400/20" />
        <div className="ambient-orb delay right-[-1rem] bottom-[-2rem] h-28 w-28 bg-sky-500/20" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        <div className="relative">
          <p className="text-lg font-semibold">Analyzing slit-lamp image...</p>
          <p className="text-sm text-slate-200/90">Running EfficientNet-V2-M inference and preparing Grad-CAM output.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {stages.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Icon className="h-4 w-4" />
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#0ea5e9_100%)]" />
            </div>
            <span className="whitespace-nowrap text-sm font-medium text-slate-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}