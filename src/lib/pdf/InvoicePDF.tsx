import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#0f172a' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  logo: { width: 64, height: 64, objectFit: 'contain', marginBottom: 8 },
  businessName: { fontSize: 13, fontWeight: 'bold', marginBottom: 3 },
  businessLine: { fontSize: 9, color: '#475569', marginBottom: 1 },
  invoiceTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, textAlign: 'right' },
  metaLine: { fontSize: 9, color: '#475569', textAlign: 'right', marginBottom: 1 },
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
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  billToLine: { fontSize: 10, color: '#334155', marginBottom: 1 },
  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
    paddingBottom: 5,
    marginBottom: 2,
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#64748b',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    borderTopColor: '#0f172a',
  },
  totalLabel: { fontSize: 12, fontWeight: 'bold', marginRight: 16 },
  totalAmount: { fontSize: 14, fontWeight: 'bold' },
  footer: { marginTop: 32 },
  footerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerText: { fontSize: 9, color: '#475569', marginBottom: 8, lineHeight: 1.4 },
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
  invoiceNumber: string
  status: 'paid' | 'unpaid'
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

export function InvoicePDF({
  logoUrl,
  businessName,
  businessContactName,
  businessAddress,
  businessPhone,
  businessEmail,
  businessWebsite,
  paymentInstructions,
  invoiceNumber,
  status,
  issueDate,
  dueDate,
  clientName,
  clientEmail,
  clientAddress,
  lineItems,
  notes,
  total,
}: InvoicePDFProps) {
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
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.metaLine}>{invoiceNumber}</Text>
            <Text style={styles.metaLine}>Issued: {issueDate}</Text>
            {dueDate && <Text style={styles.metaLine}>Due: {dueDate}</Text>}
            <Text
              style={{
                ...styles.statusBadge,
                backgroundColor: status === 'paid' ? '#dcfce7' : '#fef3c7',
                color: status === 'paid' ? '#166534' : '#92400e',
              }}
            >
              {status === 'paid' ? 'PAID' : 'UNPAID'}
            </Text>
          </View>
        </View>

        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Bill To</Text>
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
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${fmt(total)}</Text>
        </View>

        {(paymentInstructions || notes) && (
          <View style={styles.footer}>
            {paymentInstructions && (
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
