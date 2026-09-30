import { useState } from 'react'
import { features } from '../data/sampleData'

function Features() {
  const [query, setQuery] = useState('')

  const filtered = features.filter((feature) => {
    const q = query.toLowerCase()
    return (
      feature.title.includes(q) ||
      feature.heading.toLowerCase().includes(q) ||
      feature.description.toLowerCase().includes(q)
    )
  })

  return (
    <section id="features" className="public-section">
      <div className="section-heading">
        <p>FEATURES</p>
        <h2>What you can do with FinNest</h2>
        <span>A few simple tools to keep track of where your money goes.</span>

        <div className="feature-search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7b8782" strokeWidth="1.5">
            <circle cx="7" cy="7" r="5.5" />
            <line x1="11.2" y1="11.2" x2="15" y2="15" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            id="featureSearchInput"
            placeholder="Search features (e.g. Expense, Analytics)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="feature-grid" id="featureGrid">
        {filtered.map((feature) => (
          <div className="feature-card" data-title={feature.title} key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.heading}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
