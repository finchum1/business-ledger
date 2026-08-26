import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#241f16' },
  header: { marginBottom: 20 },
  brand: { fontSize: 10, color: '#957a50', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 11, color: '#6f5a39', marginBottom: 2 },
  businessList: { fontSize: 9, color: '#baa078', marginTop: 6 },
  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#957a50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#241f16',
    paddingBottom: 5,
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#957a50',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ede3d4',
  },
  cellName: { flex: 2, color: '#4c3c24' },
  cellCount: { flex: 1, textAlign: 'right', color: '#4c3c24' },
  cellAmount: { flex: 1, textAlign: 'right', color: '#c1502a' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#baa078',
    textAlign: 'center',
  },
})

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export interface ContractorReportPDFProps {
  scopeLabel: string
  periodLabel: string
  rows: { name: string; total: number; count: number }[]
  totalPaid: number
  businessNames: string[]
}

export function ContractorReportPDF({
  scopeLabel,
  periodLabel,
  rows,
  totalPaid,
  businessNames,
}: ContractorReportPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Sovereign Books</Text>
          <Text style={styles.title}>Contractor Report</Text>
          <Text style={styles.subtitle}>{scopeLabel}</Text>
          <Text style={styles.subtitle}>{periodLabel}</Text>
          {businessNames.length > 0 && (
            <Text style={styles.businessList}>Includes: {businessNames.join(', ')}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paid by contractor</Text>
          {rows.length === 0 ? (
            <Text style={styles.cellName}>No contractor payments recorded for this period.</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.cellName}>Contractor</Text>
                <Text style={styles.cellCount}>Payments</Text>
                <Text style={styles.cellAmount}>Total paid</Text>
              </View>
              {rows.map((row) => (
                <View style={styles.row} key={row.name}>
                  <Text style={styles.cellName}>{row.name}</Text>
                  <Text style={styles.cellCount}>{row.count}</Text>
                  <Text style={styles.cellAmount}>${fmt(row.total)}</Text>
                </View>
              ))}
            </>
          )}
          <View style={styles.totalRow}>
            <Text>Total paid to contractors</Text>
            <Text style={{ color: '#c1502a' }}>${fmt(totalPaid)}</Text>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Generated {new Date().toLocaleString()} · Sovereign Books
        </Text>
      </Page>
    </Document>
  )
}
