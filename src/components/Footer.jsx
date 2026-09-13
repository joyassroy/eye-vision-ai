import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 py-8">
      <div className="section-shell flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>EyeVision AI is a research and educational prototype for slit-lamp image analysis.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-slate-900" to="/disclaimer">
            Disclaimer
          </Link>
          <Link className="hover:text-slate-900" to="/about">
            About
          </Link>
          <Link className="hover:text-slate-900" to="/research">
            Research
          </Link>
        </div>
      </div>
    </footer>
  )
}