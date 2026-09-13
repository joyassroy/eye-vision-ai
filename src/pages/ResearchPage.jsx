import { useEffect, useRef, useState } from 'react'
import {
  BookOpen, Brain, Download, FileText, FlaskConical,
  GitMerge, Target, CheckCircle2, ChevronRight,
  Users, Sparkles, Layers, Activity, GraduationCap,
  AlertTriangle, ArrowRight, Beaker, Database, Cpu, Settings2
} from 'lucide-react'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'
import { MODEL_REPORT } from '../constants/modelReport.js'

/* ─── Animated counter on scroll ─── */
function AnimatedNum({ value, suffix = '', decimals = 1, duration = 1800 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1)
            setDisplay((1 - Math.pow(1 - p, 3)) * value)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.25 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{display.toFixed(decimals)}{suffix}</span>
}

/* ─── Radial ring chart ─── */
function RingChart({ value, max = 100, size = 80, strokeWidth = 7, color, children }) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const [offset, setOffset] = useState(circumference)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setOffset(circumference - (value / max) * circumference), 100)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, max, circumference])

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-[2000ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export function ResearchPage() {
  return (
    <div className="section-shell space-y-14">

      {/* ═══════════════ HERO / HEADER ═══════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.18)] fade-up">
        {/* Dark gradient hero band */}
        <div className="hero-gradient relative px-8 py-14 md:px-14 md:py-20">
          <div className="absolute inset-0 subtle-grid opacity-[0.06]" />
          <div className="ambient-orb left-8 top-8 h-40 w-40 bg-violet-500/15" />
          <div className="ambient-orb delay bottom-4 right-8 h-56 w-56 bg-cyan-400/10" />

          <div className="relative z-10 mx-auto max-w-4xl text-center space-y-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 backdrop-blur-md">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Final Year Design Project · Daffodil International University</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.25] tracking-tight text-white sm:text-4xl xl:text-[2.85rem]">
              Optimizing Multi-Label{' '}
              <span className="inline bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent" style={{ WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' }}>
                Ocular Lesion Detection
              </span>{' '}
              System utilizing Deep Learning and Bayesian Optimization
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              A multi-label deep learning system that simultaneously predicts <span className="font-semibold text-white">15 ophthalmic conditions</span> from slit-lamp images, powered by <span className="font-semibold text-cyan-300">EfficientNet-V2-M</span> and optimized via <span className="font-semibold text-cyan-300">Optuna Bayesian Optimization</span>.
            </p>
          </div>
        </div>

        {/* White info panel below hero */}
        <div className="relative bg-white/90 backdrop-blur-xl px-8 py-8 md:px-14">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Authors */}
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <Users className="h-3.5 w-3.5" /> Authors
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Dipta Acharjee', id: '0242220005101603' },
                    { name: 'Joyassroy Barua', id: '0242220005101616' },
                  ].map((author) => (
                    <div key={author.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{author.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">ID: {author.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supervision */}
              <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <BookOpen className="h-3.5 w-3.5" /> Supervision
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Supervisor</span>
                    <span className="text-sm font-semibold text-slate-700">Abdullah Al Kafi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-700">Co-Supervisor</span>
                    <span className="text-sm font-semibold text-slate-700">Mst. Umme Ayman</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Department of Computer Science & Engineering</p>
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="mt-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Abstract</span>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                The timely and proper diagnosis of eye diseases is essential to prevent vision loss. This study describes an automated multi-label deep learning system that simultaneously predicts <strong className="text-slate-800">15 ophthalmic conditions</strong> (Cataract, Keratitis, Corneal tumors, etc.) from slit-lamp images. Evaluated on a dataset of <strong className="text-slate-800">2,617 clinical images</strong> split via iterative stratification into 70/15/15 subsets. The architecture adapts an <strong className="text-slate-800">EfficientNet-V2-M</strong> backbone through transfer learning. Via <strong className="text-slate-800">Bayesian Optimization (Optuna)</strong>, the model navigated complex hyperparameter search spaces to minimize loss, establishing a promising computational resource for ophthalmologists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HEADLINE METRICS ═══════════════ */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 fade-up" style={{ animationDelay: '80ms' }}>
        {[
          { label: 'Test Accuracy', val: MODEL_REPORT.testAccuracy * 100, suffix: '%', color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
          { label: 'Precision', val: MODEL_REPORT.precision * 100, suffix: '%', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Recall', val: MODEL_REPORT.recall * 100, suffix: '%', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
          { label: 'F1-Score', val: MODEL_REPORT.macroF1Score * 100, suffix: '%', color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
        ].map((m, i) => (
          <div key={m.label} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 text-center shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(2,6,23,0.18)]" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${m.gradient} opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.14]`} />
            <RingChart value={m.val} size={72} strokeWidth={6} color={m.color}>
              <span className={`text-sm font-extrabold bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}>
                <AnimatedNum value={m.val} suffix="" decimals={1} />
              </span>
            </RingChart>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{m.label}</p>
            <p className={`mt-0.5 text-lg font-extrabold bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}>
              {m.val.toFixed(1)}{m.suffix}
            </p>
          </div>
        ))}
      </section>

      {/* ═══════════════ GAP ANALYSIS ═══════════════ */}
      <section className="space-y-6 fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Gap Analysis</h2>
            <p className="text-sm text-slate-500">Limitations in existing literature this study addresses</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: AlertTriangle, title: 'Single-Disease Focus', desc: 'Previous models explicitly exclude mixed infections, suffering greatly when multiple conditions co-exist in an individual patient.', num: '01' },
            { icon: Database, title: 'Class Imbalance Ignored', desc: 'Current literature fails to address extreme long-tail class imbalances, causing algorithms to overlook rare conditions.', num: '02' },
            { icon: Cpu, title: 'High Computational Overhead', desc: 'Previous methods utilized massive architectures (like DenseNet121) incurring huge computational latency and preventing dynamic hyperparameter tuning.', num: '03' },
            { icon: Layers, title: 'Lack of Multi-label Capabilities', desc: 'Baseline models are trained for exclusive single-label prediction, misaligning with the reality of complex multi-lesion scenarios.', num: '04' },
          ].map((gap, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(2,6,23,0.18)]">
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.1]" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <gap.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-orange-400">{gap.num}</span>
                    <h3 className="text-base font-bold text-slate-900">{gap.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{gap.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ METHODOLOGY PIPELINE ═══════════════ */}
      <section className="space-y-6 fade-up" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Methodology & Architecture</h2>
            <p className="text-sm text-slate-500">End-to-end pipeline from raw images to explainable predictions</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {[
            { icon: Database, color: 'from-blue-500 to-indigo-600', title: 'Dataset', subtitle: '2,617 Images', desc: 'MultiLabelBinarizer converts JSON annotations of 15 overlapping conditions into multi-hot binary vectors.', step: 1 },
            { icon: GitMerge, color: 'from-purple-500 to-violet-600', title: 'Stratified Split', subtitle: '70 / 15 / 15', desc: 'Iterative stratified splitting ensures proportional representation of rare labels across all subsets.', step: 2 },
            { icon: Sparkles, color: 'from-emerald-500 to-teal-600', title: 'Augmentation', subtitle: 'On-the-fly', desc: 'Rotations (±10°), affine transforms, horizontal flips, and color jitter to combat overfitting.', step: 3 },
            { icon: Brain, color: 'from-cyan-500 to-blue-600', title: 'EfficientNet-V2-M', subtitle: 'Transfer Learning', desc: 'Frozen ImageNet backbone with a custom dropout (0.30) classification head outputting 15 logits.', step: 4 },
            { icon: Activity, color: 'from-rose-500 to-pink-600', title: 'Optuna + BCE', subtitle: 'Bayesian Opt.', desc: 'BCEWithLogitsLoss for multi-label. Hyperparameters optimized via TPE algorithm in Optuna.', step: 5 },
          ].map((s, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(2,6,23,0.18)]">
              <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]`} />

              {/* Step number */}
              <span className="absolute right-4 top-3 text-[40px] font-black leading-none text-slate-100 transition-colors group-hover:text-slate-200/80">
                {s.step}
              </span>

              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-4 text-sm font-extrabold text-slate-900">{s.title}</h3>
              <span className={`relative mt-0.5 inline-block rounded-md bg-gradient-to-r ${s.color} px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white`}>
                {s.subtitle}
              </span>
              <p className="relative mt-2.5 text-xs leading-5 text-slate-500">{s.desc}</p>

              {/* Arrow connector (hidden on last and mobile) */}
              {i < 4 && (
                <div className="pointer-events-none absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 md:block">
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ RESULTS & BENCHMARKING ═══════════════ */}
      <section className="space-y-6 fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Empirical Results</h2>
            <p className="text-sm text-slate-500">Optimal hyperparameters & comparative evaluation</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Optimal Parameters */}
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur">
            <div className="border-b border-slate-100 px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
                  <Beaker className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Optimal Parameters (Optuna)</h3>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3.5">
              {[
                { label: 'Learning Rate', value: MODEL_REPORT.learningRate.toExponential(2) },
                { label: 'Optimizer', value: MODEL_REPORT.optimizer },
                { label: 'Batch Size', value: MODEL_REPORT.batchSize },
                { label: 'Weight Decay', value: MODEL_REPORT.weightDecay.toExponential(2) },
                { label: 'Dropout', value: MODEL_REPORT.dropout },
                { label: 'Epochs', value: MODEL_REPORT.epochs },
              ].map((param) => (
                <div key={param.label} className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-2.5 transition-colors hover:bg-slate-100/80">
                  <span className="text-sm text-slate-500">{param.label}</span>
                  <span className="rounded-lg bg-white px-3 py-1 font-mono text-sm font-bold text-cyan-600 shadow-sm">{param.value}</span>
                </div>
              ))}
            </div>

            {/* Test results badge */}
            <div className="mx-6 mb-6 grid grid-cols-2 gap-3">
              {[
                { label: 'Test Loss', val: MODEL_REPORT.testLoss.toFixed(4), color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
                { label: 'Test Accuracy', val: `${(MODEL_REPORT.testAccuracy * 100).toFixed(2)}%`, color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-100' },
              ].map((t) => (
                <div key={t.label} className={`rounded-xl border p-3.5 ${t.bg}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.label}</span>
                  <span className={`mt-1 block text-xl font-black ${t.color}`}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Benchmarking */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.4)]">
            <div className="border-b border-white/[0.06] px-6 pt-6 pb-4">
              <h3 className="text-base font-bold text-white">Comparative Benchmarking</h3>
              <p className="mt-0.5 text-xs text-slate-400">EfficientNet-V2-M outperformed deeper alternatives</p>
            </div>
            <div className="px-6 py-6 space-y-5">
              {[
                { name: 'EfficientNet-V2-M', badge: 'Proposed', acc: 96.6, f1: 69.5, color: 'bg-cyan-400', textColor: 'text-cyan-400', isProposed: true },
                { name: 'ResNet50', acc: 95.8, f1: 61.5, color: 'bg-slate-500', textColor: 'text-slate-300' },
                { name: 'DenseNet121', acc: 95.3, f1: 60.4, color: 'bg-slate-600', textColor: 'text-slate-400' },
              ].map((model) => (
                <div key={model.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${model.textColor}`}>{model.name}</span>
                      {model.badge && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <span className="font-semibold text-white">{model.acc}%</span> Acc
                      <span className="mx-1.5 text-slate-600">·</span>
                      <span className="font-semibold text-white">{model.f1}%</span> F1
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {/* Accuracy bar */}
                    <div className="flex-1">
                      <div className="mb-0.5 text-[9px] font-medium text-slate-500">Accuracy</div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div className={`h-full rounded-full ${model.color} transition-all duration-1000`} style={{ width: `${model.acc}%` }} />
                      </div>
                    </div>
                    {/* F1 bar */}
                    <div className="flex-1">
                      <div className="mb-0.5 text-[9px] font-medium text-slate-500">F1-Score</div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div className={`h-full rounded-full ${model.color} opacity-70 transition-all duration-1000`} style={{ width: `${model.f1}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-6 mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-slate-400">
              <span className="font-bold text-amber-400">Note:</span> DenseNet121 incurred excessive computational latency (9,934s training time), whereas EfficientNet-V2-M drastically reduced overhead while improving both accuracy and F1-Score.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DOWNLOAD FULL REPORT ═══════════════ */}
      <section className="fade-up" style={{ animationDelay: '260ms' }}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0b1c33] to-slate-950 p-10 text-center sm:p-14 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.10),transparent_40%)]" />
          <div className="absolute inset-0 subtle-grid opacity-[0.04]" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center space-y-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg backdrop-blur-md">
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Dive Deeper into the Research
              </h2>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                Download the complete Final Year Design Project report for mathematical formulations, clinical dataset details, interaction plots, and t-SNE latent feature visualizations.
              </p>
            </div>

            <a
              href="/research_report.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_8px_30px_-6px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-6px_rgba(6,182,212,0.6)]"
            >
              <Download className="h-5 w-5" />
              Download Full Report (PDF)
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
              Format: PDF · Full Document
            </p>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  )
}