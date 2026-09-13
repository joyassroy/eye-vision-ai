import { ArrowRight, Microscope, ScanEye, ShieldCheck, Sparkles, Activity, Eye, Zap, TrendingUp, Brain, BarChart3, Target, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'
import { MODEL_REPORT, MODEL_TRAINING_TRENDS } from '../constants/modelReport.js'

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, suffix = '', decimals = 1, duration = 2000 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(eased * value)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}{suffix}
    </span>
  )
}

/* ─── Mini SVG Line Chart ─── */
function MiniChart({ data, dataKey, color, height = 64, className = '' }) {
  const max = Math.max(...data.map(d => d[dataKey]))
  const min = Math.min(...data.map(d => d[dataKey]))
  const range = max - min || 1
  const w = 200
  const h = height
  const padding = 4

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (w - 2 * padding)
    const y = h - padding - ((d[dataKey] - min) / range) * (h - 2 * padding)
    return `${x},${y}`
  })

  const areaPoints = [...points, `${padding + ((data.length - 1) / (data.length - 1)) * (w - 2 * padding)},${h}`, `${padding},${h}`]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={`grad-${dataKey}-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints.join(' ')}
        fill={`url(#grad-${dataKey}-${color.replace('#', '')})`}
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* endpoint dot */}
      {points.length > 0 && (() => {
        const last = points[points.length - 1].split(',')
        return <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} />
      })()}
    </svg>
  )
}

/* ─── Training Progress Bar ─── */
function ProgressBar({ value, max = 1, color, label, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth((value / max) * 100), delay)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, max, delay])

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-800">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-[1800ms] ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  )
}

const features = [
  {
    title: 'Multi-Label Detection',
    description: 'Independent probabilities for each of the 15 supported anterior-segment conditions via sigmoid output.',
    icon: ScanEye,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Explainable AI',
    description: 'Grad-CAM visualizations highlight regions that contributed most to each prediction.',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Grad-CAM Localization',
    description: 'Server-side interpretability pipeline generates real heatmap overlays for every prediction.',
    icon: Microscope,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'EfficientNet-V2-M',
    description: 'State-of-the-art backbone running PyTorch inference on CUDA or CPU with optimized preprocessing.',
    icon: ShieldCheck,
    gradient: 'from-amber-500 to-orange-600',
  },
]

const diseases = [
  'Cataract', 'Conjunctival cyst', 'Conjunctival injection', 'Corneal / Conjunctival tumor',
  'Corneal dystrophy', 'Corneal scarring', 'Intraocular lens', 'Keratitis',
  'Lens dislocation', 'Lens dislocation/Cataract', 'Normal', 'Pigmented nevus',
  'Pinguecula', 'Pterygium', 'Subconjunctival hemorrhage',
]

export function HomePage() {
  return (
    <div className="section-shell space-y-16">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.18)] backdrop-blur-xl fade-up">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-200/40 via-sky-100/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-blue-200/30 via-indigo-100/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-gradient-to-br from-violet-200/20 to-transparent blur-3xl" />

        <div className="relative grid gap-8 p-8 md:p-12 xl:grid-cols-[1.15fr_0.85fr] xl:gap-12">

          {/* Left: Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-200/80 bg-gradient-to-r from-cyan-50 to-sky-50 px-4 py-2 shadow-sm">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Research AI for Slit-Lamp Analysis</span>
              </div>

              <h1 className="max-w-2xl text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl xl:text-[3.5rem]">
                AI-Powered{' '}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Eye Disease
                </span>{' '}
                Analysis
              </h1>
              <p className="max-w-xl text-[1.05rem] leading-7 text-slate-600">
                Analyze slit-lamp images using a deep learning model trained for multi-label detection of anterior segment eye conditions with real-time Grad-CAM explanations.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/analysis"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_-6px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-6px_rgba(15,23,42,0.6)]"
              >
                <Eye className="h-4.5 w-4.5" />
                Analyze an Image
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/research"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <FlaskConical className="h-4 w-4 text-slate-500" />
                Explore the Research
              </Link>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Test Accuracy', value: `${(MODEL_REPORT.testAccuracy * 100).toFixed(1)}%`, icon: Target },
                { label: 'Validation Loss', value: MODEL_REPORT.bestValidationLoss.toFixed(4), icon: TrendingUp },
                { label: 'Disease Classes', value: MODEL_REPORT.numClasses, icon: BarChart3 },
                { label: 'Epochs Trained', value: MODEL_REPORT.epochs, icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 transition-all duration-300 hover:border-cyan-200 hover:bg-cyan-50/30 hover:shadow-sm">
                  <stat.icon className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-cyan-600" />
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{stat.label}</span>
                    <span className="block text-sm font-bold text-slate-900">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dark Visualization Panel */}
          <div className="hero-gradient relative flex items-center justify-center overflow-hidden rounded-[2rem] p-6 min-h-[480px]">
            <div className="absolute inset-0 subtle-grid opacity-[0.08]" />

            {/* Floating orbs */}
            <div className="ambient-orb left-4 top-4 h-32 w-32 bg-cyan-400/15" />
            <div className="ambient-orb delay bottom-8 right-4 h-44 w-44 bg-blue-500/12" />
            <div className="ambient-orb left-1/2 top-1/2 h-24 w-24 bg-indigo-400/10" style={{ animationDelay: '-3s' }} />

            <div className="relative z-10 w-full max-w-sm space-y-4">
              {/* Input preview */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Input Scan</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">224 × 224</span>
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06] bg-slate-900/50">
                  <div className="aspect-[4/3] shimmer bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),rgba(15,23,42,0.95)_65%)]">
                    <div className="flex h-full items-center justify-center">
                      <Eye className="h-10 w-10 text-cyan-500/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Model info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                  <Brain className="mb-2 h-4 w-4 text-cyan-400" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Model</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{MODEL_REPORT.architecture}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                  <Activity className="mb-2 h-4 w-4 text-emerald-400" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Explainability</p>
                  <p className="mt-0.5 text-sm font-bold text-white">Grad-CAM</p>
                </div>
              </div>

              {/* Live metrics bar */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Train Accuracy</span>
                    <span className="mt-0.5 block text-lg font-bold text-white">{(MODEL_REPORT.finalTrainAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Val Accuracy</span>
                    <span className="mt-0.5 block text-lg font-bold text-white">{(MODEL_REPORT.finalValAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Optimizer</span>
                    <span className="mt-0.5 block text-sm font-semibold text-cyan-300">{MODEL_REPORT.optimizer}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Batch Size</span>
                    <span className="mt-0.5 block text-sm font-semibold text-cyan-300">{MODEL_REPORT.batchSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section className="space-y-8">
        <div className="text-center fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Capabilities</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Powered by Modern Deep Learning
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
            A complete AI pipeline from image upload to explainable predictions, built for transparency.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.14)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-16px_rgba(2,6,23,0.22)] fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Hover glow */}
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]`} />

                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* ═══════════════ PERFORMANCE METRICS ═══════════════ */}
      <section className="space-y-8">
        <div className="text-center fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Performance</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Model Evaluation Results
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 fade-up">
          {[
            { label: 'Test Accuracy', value: MODEL_REPORT.testAccuracy, color: 'from-cyan-500 to-blue-500', numVal: MODEL_REPORT.testAccuracy * 100, suffix: '%' },
            { label: 'Precision', value: MODEL_REPORT.precision, color: 'from-emerald-500 to-teal-500', numVal: MODEL_REPORT.precision * 100, suffix: '%' },
            { label: 'Recall', value: MODEL_REPORT.recall, color: 'from-violet-500 to-purple-500', numVal: MODEL_REPORT.recall * 100, suffix: '%' },
            { label: 'Macro F1-Score', value: MODEL_REPORT.macroF1Score, color: 'from-amber-500 to-orange-500', numVal: MODEL_REPORT.macroF1Score * 100, suffix: '%' },
          ].map((metric, i) => (
            <div
              key={metric.label}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.12)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(2,6,23,0.2)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${metric.color} opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.15]`} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
              <p className={`mt-2 text-4xl font-extrabold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                <AnimatedNumber value={metric.numVal} suffix={metric.suffix} />
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-[2000ms] ease-out`}
                  style={{ width: `${metric.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TRAINING PROGRESS ═══════════════ */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Left: Training charts & summary */}
        <div className="space-y-4 fade-up">
          {/* Training outcome */}
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.14)] backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Training Progress</p>
                <h3 className="text-lg font-bold text-slate-950">Loss & Accuracy Over Epochs</h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Training Loss</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{MODEL_REPORT.finalTrainLoss.toFixed(4)}</p>
                <MiniChart data={MODEL_TRAINING_TRENDS} dataKey="trainLoss" color="#0ea5e9" height={50} className="mt-2" />
              </div>
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Validation Loss</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{MODEL_REPORT.finalValLoss.toFixed(4)}</p>
                <MiniChart data={MODEL_TRAINING_TRENDS} dataKey="valLoss" color="#8b5cf6" height={50} className="mt-2" />
              </div>
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Training Accuracy</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{(MODEL_REPORT.finalTrainAccuracy * 100).toFixed(1)}%</p>
                <MiniChart data={MODEL_TRAINING_TRENDS} dataKey="trainAccuracy" color="#10b981" height={50} className="mt-2" />
              </div>
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Validation Accuracy</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{(MODEL_REPORT.finalValAccuracy * 100).toFixed(1)}%</p>
                <MiniChart data={MODEL_TRAINING_TRENDS} dataKey="valAccuracy" color="#f59e0b" height={50} className="mt-2" />
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.14)] backdrop-blur">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Final Evaluation</p>
                <h3 className="text-lg font-bold text-slate-950">Test Dataset Results</h3>
              </div>
            </div>

            <div className="space-y-4">
              <ProgressBar value={MODEL_REPORT.testAccuracy} color="linear-gradient(90deg, #06b6d4, #3b82f6)" label="Test Accuracy" delay={0} />
              <ProgressBar value={MODEL_REPORT.precision} color="linear-gradient(90deg, #10b981, #14b8a6)" label="Precision" delay={150} />
              <ProgressBar value={MODEL_REPORT.recall} color="linear-gradient(90deg, #8b5cf6, #a855f7)" label="Recall" delay={300} />
              <ProgressBar value={MODEL_REPORT.macroF1Score} color="linear-gradient(90deg, #f59e0b, #f97316)" label="Macro F1-Score" delay={450} />
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Test Loss: {MODEL_REPORT.testLoss.toFixed(4)} — Evaluated on unseen test dataset</span>
            </div>
          </div>
        </div>

        {/* Right: Epoch timeline */}
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.14)] backdrop-blur fade-up" style={{ animationDelay: '120ms' }}>
          <div className="border-b border-slate-100 px-6 pt-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Epoch Log</p>
                <h3 className="text-lg font-bold text-slate-950">All 20 Training Epochs</h3>
              </div>
            </div>
          </div>
          <div className="max-h-[620px] overflow-y-auto px-4 py-3 scrollbar-thin">
            <div className="space-y-2">
              {MODEL_TRAINING_TRENDS.map((point, i) => {
                const isLast = i === MODEL_TRAINING_TRENDS.length - 1
                const isBest = point.valAccuracy === Math.max(...MODEL_TRAINING_TRENDS.map(d => d.valAccuracy))
                return (
                  <div
                    key={point.epoch}
                    className={`group rounded-xl border p-3.5 transition-all duration-300 hover:shadow-md ${
                      isLast
                        ? 'border-cyan-200 bg-gradient-to-r from-cyan-50/80 to-sky-50/60 shadow-sm'
                        : isBest
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold ${
                          isLast ? 'bg-cyan-600 text-white' : isBest ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {point.epoch}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">Epoch {point.epoch}</span>
                        {isLast && <span className="rounded-full bg-cyan-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Final</span>}
                        {isBest && !isLast && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Best Val</span>}
                      </div>
                      <span className={`text-sm font-bold ${isLast ? 'text-cyan-700' : isBest ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {(point.valAccuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-4 gap-2">
                      {[
                        { l: 'T.Loss', v: point.trainLoss.toFixed(4) },
                        { l: 'V.Loss', v: point.valLoss.toFixed(4) },
                        { l: 'T.Acc', v: `${(point.trainAccuracy * 100).toFixed(1)}%` },
                        { l: 'V.Acc', v: `${(point.valAccuracy * 100).toFixed(1)}%` },
                      ].map(({ l, v }) => (
                        <div key={l} className="text-center">
                          <span className="block text-[9px] font-medium uppercase tracking-wider text-slate-400">{l}</span>
                          <span className="block text-[11px] font-semibold text-slate-700">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DISEASE CLASSES ═══════════════ */}
      <section className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-8 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.14)] backdrop-blur fade-up">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Coverage</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            15 Detectable Conditions
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            The model classifies anterior-segment slit-lamp images across these disease categories.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {diseases.map((disease, i) => (
            <span
              key={disease}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                disease === 'Normal'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
                  : 'border-slate-150 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/50 hover:text-cyan-700'
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {disease}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ RESEARCH DISCLAIMER ═══════════════ */}
      <section className="overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/90 via-cyan-50/60 to-blue-50/40 p-6 backdrop-blur fade-up">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-md">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">For Research & Educational Use Only</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This system is an AI research prototype. Predictions are generated from image data and should not be interpreted as medical diagnosis. Always consult a qualified eye-care professional.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  )
}