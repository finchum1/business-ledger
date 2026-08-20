import { supabase } from './supabase'

const BUCKET = 'receipts'

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-')
}

/** Uploads a receipt file and returns the storage path to save on the transaction. */
export async function uploadReceipt(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${sanitizeFilename(file.name)}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}

/** Removes a receipt file from storage (best-effort; ignore failure). */
export async function deleteReceipt(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path])
}

/** Gets a short-lived signed URL for viewing/downloading a private receipt. */
export async function getReceiptUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60)
  if (error) throw error
  return data.signedUrl
}
