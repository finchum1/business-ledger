// Bank linking (SimpleFIN) is held back from public signups for now, per an
// explicit decision made when the app went multi-tenant -- new accounts get
// everything except Banking until that's been live and solid for a while.
// This is a simple, honestly-temporary allowlist by email, not a real
// feature-flag system; swap it for a proper `beta_features` column (or
// similar) once there's more than one person to gate.
const BANKING_BETA_EMAILS = ['terrencefinchum@gmail.com']

export function hasBankingAccess(email: string | null | undefined): boolean {
  return !!email && BANKING_BETA_EMAILS.includes(email.toLowerCase())
}
