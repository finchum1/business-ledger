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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ede3d4',
  },
  rowLabel: { color: '#4c3c24' },
  rowAmountIncome: { color: '#1c8054' },
  rowAmountExpense: { color: '#c1502a' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    fontWeight: 'bold',
  },
  netSection: {
    marginTop: 26,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#241f16',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: { fontSize: 14, fontWeight: 'bold' },
  netAmount: { fontSize: 20, fontWeight: 'bold' },
  byBusinessHeader: {
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
  byBusinessCell: { flex: 2 },
  byBusinessCellRight: { flex: 1, textAlign: 'right' },
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

export interface ReportPDFProps {
  scopeLabel: string
  periodLabel: string
  incomeByCategory: [string, number][]
  expensesByCategory: [string, number][]
  totalIncome: number
  totalExpenses: number
  net: number
  perBusiness: { name: string; income: number; expenses: number; net: number }[]
  /** Every business rolled into this report (only meaningful/passed when scope is "all"). */
  businessNames: string[]
}

export function ReportPDF({
  scopeLabel,
  periodLabel,
  incomeByCategory,
  expensesByCategory,
  totalIncome,
  totalExpenses,
  net,
  perBusiness,
  businessNames,
}: ReportPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Business Ledger</Text>
          <Text style={styles.title}>Profit &amp; Loss</Text>
          <Text style={styles.subtitle}>{scopeLabel}</Text>
          <Text style={styles.subtitle}>{periodLabel}</Text>
          {businessNames.length > 0 && (
            <Text style={styles.businessList}>Includes: {businessNames.join(', ')}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income</Text>
          {incomeByCategory.length === 0 ? (
            <Text style={styles.rowLabel}>No income recorded.</Text>
          ) : (
            incomeByCategory.map(([cat, amt]) => (
              <View style={styles.row} key={cat}>
                <Text style={styles.rowLabel}>{cat}</Text>
                <Text style={styles.rowAmountIncome}>${fmt(amt)}</Text>
              </View>
            ))
          )}
          <View style={styles.totalRow}>
            <Text>Total Income</Text>
            <Text style={styles.rowAmountIncome}>${fmt(totalIncome)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          {expensesByCategory.length === 0 ? (
            <Text style={styles.rowLabel}>No expenses recorded.</Text>
          ) : (
            expensesByCategory.map(([cat, amt]) => (
              <View style={styles.row} key={cat}>
                <Text style={styles.rowLabel}>{cat}</Text>
                <Text style={styles.rowAmountExpense}>${fmt(amt)}</Text>
              </View>
            ))
          )}
          <View style={styles.totalRow}>
            <Text>Total Expenses</Text>
            <Text style={styles.rowAmountExpense}>${fmt(totalExpenses)}</Text>
          </View>
        </View>

        <View style={styles.netSection}>
          <Text style={styles.netLabel}>Net Profit</Text>
          <Text style={{ ...styles.netAmount, color: net >= 0 ? '#1c8054' : '#c1502a' }}>
            {net >= 0 ? '' : '-'}${fmt(Math.abs(net))}
          </Text>
        </View>

        {perBusiness.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Business</Text>
            <View style={styles.byBusinessHeader}>
              <Text style={styles.byBusinessCell}>Business</Text>
              <Text style={styles.byBusinessCellRight}>Income</Text>
              <Text style={styles.byBusinessCellRight}>Expenses</Text>
              <Text style={styles.byBusinessCellRight}>Net</Text>
            </View>
            {perBusiness.map((row) => (
              <View style={styles.row} key={row.name}>
                <Text style={styles.byBusinessCell}>{row.name}</Text>
                <Text style={{ ...styles.byBusinessCellRight, ...styles.rowAmountIncome }}>
                  ${fmt(row.income)}
                </Text>
                <Text style={{ ...styles.byBusinessCellRight, ...styles.rowAmountExpense }}>
                  ${fmt(row.expenses)}
                </Text>
                <Text style={styles.byBusinessCellRight}>${fmt(row.net)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer} fixed>
          Generated {new Date().toLocaleString()} · Business Ledger
        </Text>
      </Page>
    </Document>
  )
}
