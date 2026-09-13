import { AlertTriangle } from 'lucide-react'

export function DisclaimerBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(254,243,199,0.78))] p-4 text-amber-950 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm leading-6">
          This application is a research and educational prototype. Model predictions are generated automatically from image data and should not be interpreted as a medical diagnosis. Results may contain errors and should not replace examination, clinical judgment, or advice from a qualified eye-care professional.
        </p>
      </div>
    </div>
  )
}