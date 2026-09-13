import { Trash2, Eye, ZoomIn, Image as ImageIcon } from 'lucide-react'

export function ImagePreview({ imageUrl, fileName, onRemove }) {
  if (!imageUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur">
        <div className="flex min-h-[24rem] flex-col items-center justify-center px-8 py-12 text-center">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-slate-100 to-transparent blur-3xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm">
            <ImageIcon className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-5 text-lg font-bold text-slate-800">No Image Selected</p>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-400">
            Upload a slit-lamp photograph to preview it here before running analysis.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {['224×224', 'RGB', 'Normalized'].map((tag) => (
              <span key={tag} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_16px_48px_-16px_rgba(2,6,23,0.12)] backdrop-blur transition-shadow hover:shadow-[0_24px_60px_-16px_rgba(2,6,23,0.2)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
            <Eye className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Image Preview</p>
            <p className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">{fileName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100 hover:shadow-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      {/* Image container */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <img
            src={imageUrl}
            alt="Selected slit-lamp preview"
            className="h-[26rem] w-full object-contain"
          />
        </div>
        {/* Zoom hint overlay */}
        <div className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-1.5 rounded-lg bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <ZoomIn className="h-3 w-3" />
          Ready for analysis
        </div>
      </div>
    </div>
  )
}