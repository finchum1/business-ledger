import { useEffect, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { getLogoUrl } from '../lib/logos'

export function LogoDropZone({
  logoPath,
  file,
  removing,
  onFileSelected,
  onClearFile,
  onRemove,
  onError,
}: {
  logoPath: string | null
  file: File | null
  removing: boolean
  onFileSelected: (file: File) => void
  onClearFile: () => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function acceptFile(candidate: File) {
    if (!candidate.type.startsWith('image/')) {
      onError('Logo must be an image file.')
      return
    }
    onFileSelected(candidate)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(true)
  }
  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) acceptFile(dropped)
  }
  function handleBrowseChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (picked) acceptFile(picked)
    e.target.value = ''
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-3 transition ${
        dragActive
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-slate-300 dark:border-slate-700'
      }`}
    >
      {previewUrl ? (
        <div className="flex items-center gap-3">
          <img src={previewUrl} alt="New logo preview" className="h-12 w-12 object-contain rounded bg-slate-50" />
          <span className="text-sm text-slate-700 dark:text-slate-200 truncate flex-1">{file!.name}</span>
          <button
            type="button"
            onClick={onClearFile}
            className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-sm shrink-0"
          >
            Clear
          </button>
        </div>
      ) : logoPath && !removing ? (
        <div className="flex items-center gap-3 flex-wrap">
          <img
            src={getLogoUrl(logoPath)}
            alt="Business logo"
            className="h-12 w-12 object-contain rounded bg-slate-50"
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-sm"
          >
            Remove
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500">or drag a new file here to replace it</span>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 py-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
          <span>Drag a logo here, or</span>
          <span className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2">
            browse files
          </span>
          <input type="file" accept="image/*" onChange={handleBrowseChange} className="hidden" />
        </label>
      )}
    </div>
  )
}
