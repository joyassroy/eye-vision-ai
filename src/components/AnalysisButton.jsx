import { Loader2, Sparkles } from 'lucide-react'

export function AnalysisButton({ children, loading = false, disabled = false, className = '', ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={[
        'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        loading
          ? 'bg-slate-900 text-white'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_8px_30px_-6px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-6px_rgba(6,182,212,0.6)]',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Shine effect */}
      {!loading && (
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {children}
    </button>
  )
}