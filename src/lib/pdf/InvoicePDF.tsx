import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#241f16' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  logo: { width: 64, height: 64, objectFit: 'contain', marginBottom: 8 },
  businessName: { fontSize: 13, fontWeight: 'bold', marginBottom: 3 },
  businessLine: { fontSize: 9, color: '#6f5a39', marginBottom: 1 },
  invoiceTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, textAlign: 'right' },
  metaLine: { fontSize: 9, color: '#6f5a39', textAlign: 'right', marginBottom: 1 },
  statusBadge: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  billTo: { marginTop: 8, marginBottom: 24 },
  billToLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#957a50',
    letterSpacing: 1,
    marginBottom: 4,
  },
  billToLine: { fontSize: 10, color: '#4c3c24', marginBottom: 1 },
  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#241f16',
    paddingBottom: 5,
    marginBottom: 2,
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#957a50',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ede3d4',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colRate: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#241f16',
  },
  totalLabel: { fontSize: 12, fontWeight: 'bold', marginRight: 16 },
  totalAmount: { fontSize: 14, fontWeight: 'bold' },
  footer: { marginTop: 32 },
  footerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#957a50',
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerText: { fontSize: 9, color: '#6f5a39', marginBottom: 8, lineHeight: 1.4 },
})

export interface InvoicePDFLineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface InvoicePDFProps {
  logoUrl: string | null
  businessName: string
  businessContactName: string | null
  businessAddress: string | null
  businessPhone: string | null
  businessEmail: string | null
  businessWebsite: string | null
  paymentInstructions: string | null
  docType: 'quote' | 'invoice'
  invoiceNumber: string
  status: 'paid' | 'unpaid'
  sentAt: string | null
  approvedAt: string | null
  issueDate: string
  dueDate: string | null
  clientName: string
  clientEmail: string | null
  clientAddress: string | null
  lineItems: InvoicePDFLineItem[]
  notes: string | null
  total: number
}

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Same brass/emerald/amber palette already used throughout this file --
// react-pdf can't read Tailwind classes or CSS variables, so these badge
// colors are hand-matched to the app's --color-emerald-100/700 and
// --color-amber-100/700 tokens rather than computed from them.
const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  green: { bg: '#e7f8f1', text: '#176945' },
  amber: { bg: '#f9f2e6', text: '#6e4c11' },
  gray: { bg: '#ede3d4', text: '#4c3c24' },
}

function statusBadge(docType: 'quote' | 'invoice', status: 'paid' | 'unpaid', sentAt: string | null, approvedAt: string | null) {
  if (docType === 'invoice') {
    if (status === 'paid') return { label: 'PAID', ...BADGE_COLORS.green }
    if (sentAt) return { label: 'SENT', ...BADGE_COLORS.amber }
    return { label: 'DRAFT', ...BADGE_COLORS.gray }
  }
  if (approvedAt) return { label: 'APPROVED', ...BADGE_COLORS.green }
  if (sentAt) return { label: 'SENT', ...BADGE_COLORS.amber }
  return { label: 'DRAFT', ...BADGE_COLORS.gray }
}

export function InvoicePDF({
  logoUrl,
  businessName,
  businessContactName,
  businessAddress,
  businessPhone,
  businessEmail,
  businessWebsite,
  paymentInstructions,
  docType,
  invoiceNumber,
  status,
  sentAt,
  approvedAt,
  issueDate,
  dueDate,
  clientName,
  clientEmail,
  clientAddress,
  lineItems,
  notes,
  total,
}: InvoicePDFProps) {
  const badge = statusBadge(docType, status, sentAt, approvedAt)
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <Text style={styles.businessName}>{businessName}</Text>
            {businessContactName && <Text style={styles.businessLine}>{businessContactName}</Text>}
            {businessAddress && <Text style={styles.businessLine}>{businessAddress}</Text>}
            {businessPhone && <Text style={styles.businessLine}>{businessPhone}</Text>}
            {businessEmail && <Text style={styles.businessLine}>{businessEmail}</Text>}
            {businessWebsite && <Text style={styles.businessLine}>{businessWebsite}</Text>}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>{docType === 'quote' ? 'QUOTE' : 'INVOICE'}</Text>
            <Text style={styles.metaLine}>{invoiceNumber}</Text>
            <Text style={styles.metaLine}>Issued: {issueDate}</Text>
            {dueDate && <Text style={styles.metaLine}>Due: {dueDate}</Text>}
            <Text style={{ ...styles.statusBadge, backgroundColor: badge.bg, color: badge.text }}>
              {badge.label}
            </Text>
          </View>
        </View>

        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>{docType === 'quote' ? 'Prepared For' : 'Bill To'}</Text>
          <Text style={styles.billToLine}>{clientName}</Text>
          {clientEmail && <Text style={styles.billToLine}>{clientEmail}</Text>}
          {clientAddress && <Text style={styles.billToLine}>{clientAddress}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {lineItems.map((li, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.colDesc}>{li.description}</Text>
              <Text style={styles.colQty}>{li.quantity}</Text>
              <Text style={styles.colRate}>${fmt(li.rate)}</Text>
              <Text style={styles.colAmount}>${fmt(li.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{docType === 'quote' ? 'Estimated Total' : 'Total'}</Text>
          <Text style={styles.totalAmount}>${fmt(total)}</Text>
        </View>

        {((docType === 'invoice' && paymentInstructions) || notes) && (
          <View style={styles.footer}>
            {docType === 'invoice' && paymentInstructions && (
              <>
                <Text style={styles.footerLabel}>Payment</Text>
                <Text style={styles.footerText}>{paymentInstructions}</Text>
              </>
            )}
            {notes && (
              <>
                <Text style={styles.footerLabel}>Notes</Text>
                <Text style={styles.footerText}>{notes}</Text>
              </>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
