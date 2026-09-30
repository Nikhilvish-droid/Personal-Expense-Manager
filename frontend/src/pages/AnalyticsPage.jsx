import { categoryExpenses, paymentMethods, monthlyExpenseTrend, incomeExpenseSummary } from '../data/sampleData'

function formatCompact(amount) {
  return amount >= 1000 ? `₹${(amount / 1000).toFixed(1)}k` : `₹${amount}`
}

function formatFull(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function AnalyticsPage() {
  const maxCategory = Math.max(...categoryExpenses.map((item) => item.amount))
  const maxPayment = Math.max(...paymentMethods.map((method) => method.amount))

  const chartWidth = 300
  const chartHeight = 130
  const padX = 14
  const padY = 16
  const amounts = monthlyExpenseTrend.map((m) => m.amount)
  const maxTrend = Math.max(...amounts)
  const minTrend = Math.min(...amounts)
  const trendRange = maxTrend - minTrend || 1

  const points = monthlyExpenseTrend.map((item, i) => {
    const x = monthlyExpenseTrend.length === 1
      ? chartWidth / 2
      : padX + (i / (monthlyExpenseTrend.length - 1)) * (chartWidth - padX * 2)
    const y = chartHeight - padY - ((item.amount - minTrend) / trendRange) * (chartHeight - padY * 2)
    return { ...item, x, y }
  })
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const { income, expenses } = incomeExpenseSummary
  const total = income + expenses
  const incomePercent = Math.round((income / total) * 100)
  const expensePercent = 100 - incomePercent

  return (
    <section id="analytics" className="analytics-section">
      <div className="section-heading">
        <p>FINANCIAL ANALYTICS</p>
        <h2>Understand Your Spending</h2>
        <span>See where your money goes every month.</span>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Category-wise Expenses</h3>
          <p className="chart-description">Your spending by category</p>
          <div className="bar-chart">
            {categoryExpenses.map((item) => (
              <div className="chart-bar" key={item.label}>
                <div className="bar" style={{ height: `${(item.amount / maxCategory) * 100}%` }}>
                  <span className="bar-value">{formatCompact(item.amount)}</span>
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Monthly Expenses</h3>
          <p className="chart-description">Expense trend over time</p>
          <div className="monthly-chart">
            <svg className="trend-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <polyline className="trend-line" points={polylinePoints} />
              {points.map((p) => (
                <circle key={p.month} className="trend-dot" cx={p.x} cy={p.y} r="4">
                  <title>{p.month}: {formatFull(p.amount)}</title>
                </circle>
              ))}
            </svg>
          </div>
          <div className="month-labels">
            {monthlyExpenseTrend.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Income vs Expenses</h3>
          <p className="chart-description">Monthly comparison</p>
          <div className="comparison-container">
            <div className="comparison-item">
              <div
                className="comparison-circle income-circle"
                style={{ background: `conic-gradient(var(--accent) ${incomePercent}%, var(--accent-tint) 0)` }}
              >
                <span>{incomePercent}%</span>
              </div>
              <strong>Income</strong>
              <small>{formatFull(income)}</small>
            </div>
            <div className="comparison-item">
              <div
                className="comparison-circle expense-circle"
                style={{ background: `conic-gradient(var(--ink) ${expensePercent}%, var(--neutral-tint) 0)` }}
              >
                <span>{expensePercent}%</span>
              </div>
              <strong>Expenses</strong>
              <small>{formatFull(expenses)}</small>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Payment Method Analysis</h3>
          <p className="chart-description">How you pay</p>
          {paymentMethods.map((method) => (
            <div className="payment-item" key={method.label}>
              <span>{method.label}</span>
              <div className="payment-bar">
                <div style={{ width: `${(method.amount / maxPayment) * 100}%` }}></div>
              </div>
              <strong>{formatFull(method.amount)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="spending-trend">
        <div>
          <p>SPENDING TREND</p>
          <h3>Your spending is under control</h3>
        </div>
        <div className="trend-value">↓ 4.2%</div>
      </div>
    </section>
  )
}

export default AnalyticsPage
