import { useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

function isAcceptedReceiptFile(file: File) {
  return file.type.startsWith('image/') || file.type === 'application/pdf'
}

export function ReceiptDropZone({
  receiptPath,
  file,
  removing,
  viewing,
  onFileSelected,
  onClearFile,
  onRemove,
  onView,
  onError,
}: {
  receiptPath: string | null
  file: File | null
  removing: boolean
  viewing: boolean
  onFileSelected: (file: File) => void
  onClearFile: () => void
  onRemove: () => void
  onView: () => void
  onError: (message: string) => void
}) {
  const [dragActive, setDragActive] = useState(false)

  function acceptFile(candidate: File) {
    if (!isAcceptedReceiptFile(candidate)) {
      onError('Receipts must be an image or a PDF file.')
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
    e.target.value = '' // allow re-selecting the same file later
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
      {file ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-700 dark:text-slate-200 truncate">📎 {file.name}</span>
          <button
            type="button"
            onClick={onClearFile}
            className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
          >
            Clear
          </button>
        </div>
      ) : receiptPath && !removing ? (
        <div className="flex items-center justify-between gap-3 text-sm flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onView}
              disabled={viewing}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline underline-offset-2"
            >
              {viewing ? 'Opening…' : 'View current receipt'}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
            >
              Remove
            </button>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            or drag a new file here to replace it
          </span>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 py-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
          <span>Drag a receipt here, or</span>
          <span className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2">
            browse files
          </span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleBrowseChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
