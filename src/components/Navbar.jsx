import { Menu, Sparkles, Stethoscope, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'AI Analysis', to: '/analysis' },
  { label: 'Research', to: '/research' },
  { label: 'About', to: '/about' },
]

export function Navbar() {
  const { backendStatus } = useAnalysis()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/10 bg-white/82 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#07111f_0%,#0f2746_55%,#0ea5e9_100%)] text-white shadow-[0_20px_40px_-24px_rgba(2,132,199,0.8)]">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-bold tracking-tight text-slate-950">EyeVision AI</span>
            <span className="block text-xs font-medium text-slate-500">Anterior Segment Eye Analysis</span>
          </span>
          <span className="block sm:hidden text-lg font-bold tracking-tight text-slate-950">
            EyeVision
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive ? 'bg-slate-950 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to="/analysis"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0ea5e9_0%,#0284c7_55%,#075985_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-16px_rgba(2,132,199,0.65)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-18px_rgba(2,132,199,0.8)]"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Image
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <span
            className={[
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider',
              backendStatus === 'online'
                ? 'bg-emerald-50 text-emerald-700'
                : backendStatus === 'offline'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-100 text-slate-600',
            ].join(' ')}
          >
            <span className={`h-2 w-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500' : backendStatus === 'offline' ? 'bg-rose-500' : 'bg-slate-400'}`} />
            <span className="hidden sm:inline">
              {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="absolute inset-x-4 top-20 rounded-2xl border border-white/40 bg-white/90 p-3 shadow-[0_20px_40px_-16px_rgba(2,6,23,0.2)] backdrop-blur-2xl lg:hidden fade-up">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-4 py-3 text-sm font-bold transition-all',
                    isActive ? 'bg-slate-950 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="my-1 border-t border-slate-100" />
            <Link
              to="/analysis"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] transition-shadow hover:shadow-[0_12px_30px_-6px_rgba(6,182,212,0.6)]"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Image
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}