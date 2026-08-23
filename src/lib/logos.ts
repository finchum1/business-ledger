import { supabase } from './supabase'

const BUCKET = 'logos'

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-')
}

/** Uploads a business logo and returns the storage path to save on the business. */
export async function uploadLogo(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${sanitizeFilename(file.name)}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}

/** Removes a logo file from storage (best-effort; ignore failure). */
export async function deleteLogo(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path])
}

/** Logos live in a public bucket -- a stable public URL, no signing needed. */
export function getLogoUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
