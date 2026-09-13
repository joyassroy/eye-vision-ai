import {
  Github, ExternalLink, GraduationCap, Code2, Brain,
  Sparkles, BookOpen, Mail, MapPin, Cpu, Globe,
  Heart, FlaskConical, Eye
} from 'lucide-react'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'

const team = [
  {
    name: 'Joyassroy Barua',
    id: '0242220005101616',
    role: 'Deep Learning Engineer & Full Stack Developer',
    tagline: 'Competitive Programmer | MERN Stack Developer | ML Enthusiast',
    avatar: 'J',
    gradient: 'from-cyan-500 to-blue-600',
    ringColor: 'ring-cyan-400/30',
    github: 'https://github.com/joyassroy',
    githubHandle: '@joyassroy',
    contributions: [
      'Trained & benchmarked ResNet50 & DenseNet121 comparative models',
      'Integrated Bayesian Optimization (Optuna) for baseline hyperparameter tuning',
      'Built the interactive, fully responsive frontend with dynamic UI animations',
      'Authored comprehensive research documentation & handled cloud deployment',
    ],
    skills: ['Python', 'PyTorch', 'React', 'Node.js', 'FastAPI', 'C++'],
  },
  {
    name: 'Dipta Acharjee',
    id: '0242220005101603',
    role: 'Deep Learning Engineer & Full Stack Developer',
    tagline: 'Web Developer | MERN Stack | Next.js Developer | Full Stack Enthusiast',
    avatar: 'D',
    gradient: 'from-violet-500 to-purple-600',
    ringColor: 'ring-violet-400/30',
    github: 'https://github.com/connectdipta',
    githubHandle: '@connectdipta',
    contributions: [
      'Designed & trained the core EfficientNet-V2-M production architecture',
      'Applied Bayesian Optimization (Optuna) to fine-tune production weights',
      'Built high-performance FastAPI backend with integrated Grad-CAM serving',
      'Connected end-to-end full-stack API integration for real-time inferences',
    ],
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'Express'],
  },
]

const projectHighlights = [
  { icon: Eye, title: '15 Conditions', desc: 'Multi-label detection of anterior-segment eye diseases', color: 'from-cyan-500 to-blue-500' },
  { icon: Brain, title: 'EfficientNet-V2-M', desc: 'State-of-the-art deep learning backbone with transfer learning', color: 'from-violet-500 to-purple-500' },
  { icon: Sparkles, title: 'Grad-CAM', desc: 'Explainable AI heatmaps for transparent model decisions', color: 'from-emerald-500 to-teal-500' },
  { icon: Cpu, title: 'Optuna', desc: 'Bayesian hyperparameter optimization for peak performance', color: 'from-amber-500 to-orange-500' },
]

export function AboutPage() {
  return (
    <div className="section-shell space-y-14">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.18)] fade-up">
        <div className="hero-gradient relative px-8 py-16 md:px-14 md:py-20">
          <div className="absolute inset-0 subtle-grid opacity-[0.06]" />
          <div className="ambient-orb left-8 top-8 h-40 w-40 bg-violet-500/15" />
          <div className="ambient-orb delay bottom-4 right-8 h-48 w-48 bg-cyan-400/10" />

          <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 backdrop-blur-md">
              <Heart className="h-4 w-4 text-rose-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Meet the Team</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl xl:text-5xl">
              Built by{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                Researchers
              </span>{' '}
              Who Care About Vision
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              EyeVision AI is a Final Year Design Project by two CSE students at <span className="font-semibold text-white">Daffodil International University</span>, passionate about using technology to aid eye disease diagnosis.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM CARDS ═══════════════ */}
      <section className="grid gap-6 lg:grid-cols-2">
        {team.map((member, i) => (
          <div
            key={member.id}
            className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur transition-all duration-500 hover:shadow-[0_24px_60px_-16px_rgba(2,6,23,0.2)] fade-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* Hover glow */}
            <div className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-[0.12]`} />

            <div className="relative p-7">
              {/* Header: Avatar + Info */}
              <div className="flex items-start gap-5">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} text-2xl font-black text-white shadow-lg ring-4 ${member.ringColor}`}>
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-extrabold text-slate-900">{member.name}</h2>
                  <p className={`mt-0.5 text-sm font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>{member.role}</p>
                  <p className="mt-1 text-xs text-slate-500 truncate">{member.tagline}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                      ID: {member.id}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      <GraduationCap className="mr-1 inline h-3 w-3" />CSE · DIU
                    </span>
                  </div>
                </div>
              </div>

              {/* Contributions */}
              <div className="mt-6">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <Code2 className="h-3 w-3" /> Key Contributions
                </p>
                <ul className="mt-3 space-y-2">
                  {member.contributions.map((c, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className={`mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${member.gradient}`} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="mt-5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <Sparkles className="h-3 w-3" /> Tech Stack
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span key={skill} className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-slate-200 hover:bg-white">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub link */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/btn inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r ${member.gradient} px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <Github className="h-4 w-4" />
                  {member.githubHandle}
                  <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════ PROJECT HIGHLIGHTS ═══════════════ */}
      <section className="space-y-6 fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">About the Project</h2>
            <p className="text-sm text-slate-500">What EyeVision AI does and how it works</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectHighlights.map((h, i) => (
            <div key={h.title} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_-12px_rgba(2,6,23,0.10)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(2,6,23,0.18)]">
              <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${h.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]`} />
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${h.color} text-white shadow-md`}>
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-4 text-sm font-extrabold text-slate-900">{h.title}</h3>
              <p className="relative mt-1.5 text-xs leading-5 text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="grid gap-6 lg:grid-cols-2 fade-up" style={{ animationDelay: '240ms' }}>
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-7 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">What This Prototype Does</h3>
          </div>
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>EyeVision AI sends uploaded slit-lamp images to a <strong className="text-slate-800">Python FastAPI</strong> backend, which:</p>
            <ul className="space-y-2 ml-1">
              {[
                'Preprocesses the image (resize to 224×224, normalize with ImageNet stats)',
                'Runs inference through the trained EfficientNet-V2-M PyTorch checkpoint',
                'Returns independent sigmoid probabilities for all 15 conditions',
                'Generates a Grad-CAM heatmap overlay for explainability',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-7 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Institution & Supervision</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">University</p>
              <p className="mt-1 text-base font-bold text-slate-900">Daffodil International University</p>
              <p className="text-xs text-slate-500">Department of Computer Science & Engineering</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700">Supervisor</span>
                <p className="mt-2 text-sm font-bold text-slate-800">Abdullah Al Kafi</p>
                <p className="text-[11px] text-slate-500">Lecturer, CSE</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase text-sky-700">Co-Supervisor</span>
                <p className="mt-2 text-sm font-bold text-slate-800">Mst. Umme Ayman</p>
                <p className="text-[11px] text-slate-500">Lecturer, CSE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RESEARCH NOTICE ═══════════════ */}
      <section className="overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/90 via-cyan-50/60 to-blue-50/40 p-6 backdrop-blur fade-up" style={{ animationDelay: '280ms' }}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-md">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Research & Educational Prototype</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              EyeVision AI is a demonstration of our Final Year Design Project. It is not intended for clinical use. All predictions are auto-generated from image data and must not replace professional medical advice.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  )
}