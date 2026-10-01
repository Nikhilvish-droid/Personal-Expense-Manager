import { useEffect, useState } from 'react'

function formatCompact(amount) {
  amount = Number(amount || 0)
  return amount >= 1000
    ? `₹${(amount / 1000).toFixed(1)}k`
    : `₹${amount}`
}

function formatFull(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

function formatPaymentMethod(method) {
  if (!method) return 'Other'

  return method
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function AnalyticsPage({ user }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) {
      setLoading(false)
      return
    }

    async function fetchAnalytics() {
      try {
        const response = await fetch(
          `http://localhost:8082/api/analytics/${user.userId}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Analytics error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <section className="analytics-section">
        <div className="section-heading">
          <p>FINANCIAL ANALYTICS</p>
          <h2>Understand Your Spending</h2>
          <span>Loading your analytics...</span>
        </div>
      </section>
    )
  }

  if (!analytics) {
    return (
      <section className="analytics-section">
        <div className="section-heading">
          <p>FINANCIAL ANALYTICS</p>
          <h2>Understand Your Spending</h2>
          <span>Unable to load analytics.</span>
        </div>
      </section>
    )
  }

  const categoryExpenses = analytics.categoryExpenses || []
  const monthlyExpenseTrend = analytics.monthlyExpenses || []
  const paymentMethods = analytics.paymentMethods || []

  const income = Number(analytics.totalIncome || 0)
  const expenses = Number(analytics.totalExpense || 0)

  const maxCategory = Math.max(
    ...categoryExpenses.map((item) => Number(item.amount)),
    1
  )

  const maxPayment = Math.max(
    ...paymentMethods.map((method) => Number(method.amount)),
    1
  )

  const chartWidth = 300
  const chartHeight = 130
  const padX = 14
  const padY = 16

  const amounts = monthlyExpenseTrend.map((item) =>
    Number(item.amount)
  )

  const maxTrend = Math.max(...amounts, 0)
  const minTrend = Math.min(...amounts, 0)
  const trendRange = maxTrend - minTrend || 1

  const points = monthlyExpenseTrend.map((item, i) => {
    const x =
      monthlyExpenseTrend.length === 1
        ? chartWidth / 2
        : padX +
          (i / (monthlyExpenseTrend.length - 1)) *
            (chartWidth - padX * 2)

    const y =
      chartHeight -
      padY -
      ((Number(item.amount) - minTrend) / trendRange) *
        (chartHeight - padY * 2)

    return {
      ...item,
      x,
      y
    }
  })

  const polylinePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(' ')

  const total = income + expenses

  const incomePercent =
    total === 0 ? 0 : Math.round((income / total) * 100)

  const expensePercent =
    total === 0 ? 0 : 100 - incomePercent

  return (
    <section id="analytics" className="analytics-section">

      <div className="section-heading">
        <p>FINANCIAL ANALYTICS</p>
        <h2>Understand Your Spending</h2>
        <span>See where your money goes every month.</span>
      </div>

      <div className="analytics-grid">

        {/* Category Expenses */}

        <div className="analytics-card">
          <h3>Category-wise Expenses</h3>
          <p className="chart-description">
            Your spending by category
          </p>

          {categoryExpenses.length === 0 ? (
            <p>No expense data available.</p>
          ) : (
            <div className="bar-chart">
              {categoryExpenses.map((item) => (
                <div className="chart-bar" key={item.label}>

                  <div
                    className="bar"
                    style={{
                      height: `${(Number(item.amount) / maxCategory) * 100}%`
                    }}
                  >
                    <span className="bar-value">
                      {formatCompact(item.amount)}
                    </span>
                  </div>

                  <span>{item.label}</span>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Expenses */}

        <div className="analytics-card">
          <h3>Monthly Expenses</h3>
          <p className="chart-description">
            Expense trend over time
          </p>

          {monthlyExpenseTrend.length === 0 ? (
            <p>No monthly expense data available.</p>
          ) : (
            <>
              <div className="monthly-chart">
                <svg
                  className="trend-chart"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  <polyline
                    className="trend-line"
                    points={polylinePoints}
                  />

                  {points.map((point) => (
                    <circle
                      key={point.month}
                      className="trend-dot"
                      cx={point.x}
                      cy={point.y}
                      r="4"
                    >
                      <title>
                        {point.month}: {formatFull(point.amount)}
                      </title>
                    </circle>
                  ))}
                </svg>
              </div>

              <div className="month-labels">
                {monthlyExpenseTrend.map((item) => (
                  <span key={item.month}>
                    {item.month}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Income vs Expenses */}

        <div className="analytics-card">
          <h3>Income vs Expenses</h3>
          <p className="chart-description">
            Your financial comparison
          </p>

          <div className="comparison-container">

            <div className="comparison-item">

              <div
                className="comparison-circle income-circle"
                style={{
                  background: `conic-gradient(
                    var(--accent) ${incomePercent}%,
                    var(--accent-tint) 0
                  )`
                }}
              >
                <span>{incomePercent}%</span>
              </div>

              <strong>Income</strong>
              <small>{formatFull(income)}</small>

            </div>

            <div className="comparison-item">

              <div
                className="comparison-circle expense-circle"
                style={{
                  background: `conic-gradient(
                    var(--ink) ${expensePercent}%,
                    var(--neutral-tint) 0
                  )`
                }}
              >
                <span>{expensePercent}%</span>
              </div>

              <strong>Expenses</strong>
              <small>{formatFull(expenses)}</small>

            </div>

          </div>
        </div>

        {/* Payment Methods */}

        <div className="analytics-card">
          <h3>Payment Method Analysis</h3>
          <p className="chart-description">
            How you pay
          </p>

          {paymentMethods.length === 0 ? (
            <p>No payment data available.</p>
          ) : (
            paymentMethods.map((method) => (
              <div
                className="payment-item"
                key={method.label}
              >

                <span>
                  {formatPaymentMethod(method.label)}
                </span>

                <div className="payment-bar">
                  <div
                    style={{
                      width: `${(Number(method.amount) / maxPayment) * 100}%`
                    }}
                  />
                </div>

                <strong>
                  {formatFull(method.amount)}
                </strong>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Spending Summary */}

      <div className="spending-trend">

        <div>
          <p>SPENDING SUMMARY</p>
          <h3>
            Total expenses recorded
          </h3>
        </div>

        <div className="trend-value">
          {formatFull(expenses)}
        </div>

      </div>

    </section>
  )
}

export default AnalyticsPage