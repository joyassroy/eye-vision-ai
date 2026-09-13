import { CloudUpload, FileImage, ImageOff, Upload, Camera } from 'lucide-react'
import { useRef, useState } from 'react'

export function UploadDropzone({ onFileSelected, error, accept, maxSizeLabel = '10 MB' }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDrop(event) {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragOver
          ? 'border-cyan-400 bg-cyan-50/60 shadow-[0_0_30px_-6px_rgba(6,182,212,0.25)]'
          : error
          ? 'border-rose-300 bg-rose-50/40'
          : 'border-slate-200 bg-gradient-to-br from-slate-50/80 to-white hover:border-cyan-300 hover:bg-cyan-50/30'
      }`}
      onDragOver={(event) => { event.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Background decorative */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-200/20 to-transparent blur-3xl" />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileSelected(file)
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-5 px-6 py-14 text-center outline-none"
      >
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${
          isDragOver
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 scale-110'
            : 'bg-gradient-to-br from-slate-800 to-slate-900'
        } text-white`}>
          <CloudUpload className={`h-7 w-7 transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-bold text-slate-900">
            {isDragOver ? 'Drop your image here' : 'Upload a slit-lamp image'}
          </p>
          <p className="text-sm leading-6 text-slate-500">
            Drag & drop your image here, or <span className="font-semibold text-cyan-600">browse</span> from your device
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            {['JPG', 'PNG', 'WEBP'].map((fmt) => (
              <span key={fmt} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {fmt}
              </span>
            ))}
            <span className="text-[10px] text-slate-400">• Max {maxSizeLabel}</span>
          </div>
        </div>
      </button>

      {error ? (
        <div className="mx-4 mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="flex items-start gap-2">
            <ImageOff className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      ) : (
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">
          <FileImage className="h-3.5 w-3.5" />
          <span>Images are processed securely and not stored permanently.</span>
        </div>
      )}
    </div>
  )
}