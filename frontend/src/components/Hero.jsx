function Hero({ onGetStarted, onExploreFeatures }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-small-title">PERSONAL FINANCE TRACKER</p>
        <h1>
          Take Control of <span>Your Finances</span>
        </h1>
        <p className="hero-description">
          Track your spending, manage your income, understand your financial
          habits, and make smarter money decisions — all in one place.
        </p>
      </div>

      <div className="finance-preview">
        <div className="preview-header">
          <div>
            <p>Financial Overview</p>
            <h3>My Finances</h3>
          </div>
        </div>

        <div className="preview-balance">
          <p>Total Balance</p>
          <h2>₹52,480</h2>
          <small>Your balance after income and expenses</small>
        </div>

        <div className="preview-cards">
          <div className="preview-card">
            <p>Income</p>
            <h3>₹65,000</h3>
            <span>Monthly</span>
          </div>
          <div className="preview-card">
            <p>Expenses</p>
            <h3>₹12,520</h3>
            <span>Monthly</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
