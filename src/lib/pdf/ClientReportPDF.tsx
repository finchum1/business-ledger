import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#241f16' },
  header: { marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start' },
  logo: { width: 72, height: 72, objectFit: 'contain', marginRight: 16 },
  headerText: { flex: 1 },
  brand: { fontSize: 10, color: '#957a50', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 11, color: '#6f5a39', marginBottom: 2 },
  logoRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  smallLogo: { width: 30, height: 30, objectFit: 'contain', marginRight: 8, marginBottom: 6 },
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
  cellAmount: { flex: 1, textAlign: 'right', color: '#1f7a52' },
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

export interface ClientReportPDFProps {
  scopeLabel: string
  periodLabel: string
  rows: { name: string; total: number; count: number }[]
  totalReceived: number
  businessNames: string[]
  /** The scoped business's logo (only meaningful/passed when scope is one specific business). */
  logoUrl?: string | null
  /** Logos of every business in this report that has one (only meaningful/passed when scope is "all"). */
  logoUrls?: string[]
}

export function ClientReportPDF({
  scopeLabel,
  periodLabel,
  rows,
  totalReceived,
  businessNames,
  logoUrl,
  logoUrls,
}: ClientReportPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.brand}>Sovereign Books</Text>
            <Text style={styles.title}>Client Report</Text>
            <Text style={styles.subtitle}>{scopeLabel}</Text>
            <Text style={styles.subtitle}>{periodLabel}</Text>
            {logoUrls && logoUrls.length > 0 && (
              <View style={styles.logoRow}>
                {logoUrls.map((url, i) => (
                  <Image key={i} src={url} style={styles.smallLogo} />
                ))}
              </View>
            )}
            {businessNames.length > 0 && (
              <Text style={styles.businessList}>Includes: {businessNames.join(', ')}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Received by client</Text>
          {rows.length === 0 ? (
            <Text style={styles.cellName}>No client-tagged income recorded for this period.</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.cellName}>Client</Text>
                <Text style={styles.cellCount}>Payments</Text>
                <Text style={styles.cellAmount}>Total received</Text>
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
            <Text>Total received from clients</Text>
            <Text style={{ color: '#1f7a52' }}>${fmt(totalReceived)}</Text>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Generated {new Date().toLocaleString()} · Sovereign Books
        </Text>
      </Page>
    </Document>
  )
}
