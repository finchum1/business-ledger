import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { deleteLogo, uploadLogo } from '../lib/logos'
import { LogoDropZone } from './LogoDropZone'
import type { Business } from '../lib/types'

const inputClass =
  'w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelClass = 'block text-xs text-slate-500 dark:text-slate-400 mb-1'

export function BusinessProfileEditor({
  business,
  onSaved,
  onCancel,
}: {
  business: Business
  onSaved: () => void
  onCancel: () => void
}) {
  const [contactName, setContactName] = useState(business.contact_name ?? '')
  const [email, setEmail] = useState(business.email ?? '')
  const [phone, setPhone] = useState(business.phone ?? '')
  const [website, setWebsite] = useState(business.website ?? '')
  const [address, setAddress] = useState(business.address ?? '')
  const [paymentInstructions, setPaymentInstructions] = useState(business.payment_instructions ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [removingLogo, setRemovingLogo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let logoPath = removingLogo ? null : business.logo_path
      if (logoFile) {
        logoPath = await uploadLogo(logoFile)
      }
      if (business.logo_path && business.logo_path !== logoPath) {
        await deleteLogo(business.logo_path)
      }

      const { error } = await supabase
        .from('businesses')
        .update({
          contact_name: contactName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          website: website.trim() || null,
          address: address.trim() || null,
          payment_instructions: paymentInstructions.trim() || null,
          logo_path: logoPath,
        })
        .eq('id', business.id)
      if (error) throw error
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save business details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-3"
    >
      <div>
        <label className={labelClass}>Logo</label>
        <LogoDropZone
          logoPath={business.logo_path}
          file={logoFile}
          removing={removingLogo}
          onFileSelected={(f) => {
            setLogoFile(f)
            setRemovingLogo(false)
          }}
          onClearFile={() => setLogoFile(null)}
          onRemove={() => setRemovingLogo(true)}
          onError={setError}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Contact name</label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Payment instructions</label>
        <textarea
          value={paymentInstructions}
          onChange={(e) => setPaymentInstructions(e.target.value)}
          rows={2}
          placeholder="e.g. Make checks payable to... or bank transfer details"
          className={inputClass}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Shown on invoices sent to clients.
        </p>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
        >
          {saving ? 'Saving…' : 'Save details'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 px-4 py-2 text-sm transition"
        >
          Close
        </button>
      </div>
    </form>
  )
}

