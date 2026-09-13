import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'

export function DisclaimerPage() {
  return (
    <div className="section-shell space-y-8">
      <div>
        <p className="muted-label">Disclaimer</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Medical Disclaimer</h1>
      </div>

      <div className="glass-panel p-6">
        <p className="text-sm leading-7 text-slate-600">
          This application is a research and educational prototype. Model predictions are generated automatically from image data and should not be interpreted as a medical diagnosis. Results may contain errors and should not replace examination, clinical judgment, or advice from a qualified eye-care professional.
        </p>
      </div>

      <DisclaimerBanner />
    </div>
  )
}