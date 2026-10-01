import { useEffect, useState } from 'react'

function SavingsGoalsPage({ user }) {
  const [goals, setGoals] = useState([])
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')

  const [contributionAmounts, setContributionAmounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function fetchGoals() {
    if (!user?.userId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8082/api/savings/goals/${user.userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch savings goals')
      }

      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Fetch savings goals error:', error)
      alert('Unable to load savings goals.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!user?.userId) {
      alert('User not found. Please login again.')
      return
    }

    setSaving(true)

    const goalData = {
      userId: user.userId,
      goalName: name,
      targetAmount: Number(target),
      currentAmount: 0,
      deadline: deadline || null,
      status: 'ACTIVE'
    }

    try {
      const response = await fetch(
        'http://localhost:8082/api/savings/goals',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(goalData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to add goal.')
        return
      }

      alert('Goal added successfully.')

      setName('')
      setTarget('')
      setDeadline('')

      fetchGoals()
    } catch (error) {
      console.error('Add savings goal error:', error)
      alert('Unable to connect to the server.')
    } finally {
      setSaving(false)
    }
  }

  async function handleContribution(goalId) {
    const amount = Number(contributionAmounts[goalId])

    if (!amount || amount <= 0) {
      alert('Please enter a valid contribution amount.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8082/api/savings/goals/${goalId}/contributions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amount,
            contributionDate: new Date()
              .toISOString()
              .split('T')[0]
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to add contribution.')
        return
      }

      alert('Contribution added successfully.')

      setContributionAmounts((current) => ({
        ...current,
        [goalId]: ''
      }))

      fetchGoals()
    } catch (error) {
      console.error('Contribution error:', error)
      alert('Unable to connect to the server.')
    }
  }

  function calculatePercent(current, target) {
    if (!target || target <= 0) return 0

    return Math.min(
      100,
      Math.round(
        (Number(current || 0) / Number(target)) * 100
      )
    )
  }

  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`
  }

  return (
    <section id="savings" className="savings-section">

      <div className="section-heading">
        <p>SAVINGS GOALS</p>
        <h2>Save Toward Something</h2>
        <span>
          Set a target and keep an eye on how close you are.
        </span>
      </div>

      <div className="savings-grid">

        {/* Add Goal */}

        <div className="income-form-card">

          <p className="form-label">GOAL</p>

          <h3>Add Goal</h3>

          <form onSubmit={handleSubmit}>

            <label>Goal Name</label>

            <input
              type="text"
              placeholder="e.g. New Laptop"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Target Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              min="1"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />

            <label>Deadline</label>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Goal'}
            </button>

          </form>

        </div>

        {/* Goals */}

        <div className="income-history-card">

          <div className="card-header">
            <h3>Your Goals</h3>
            <span>{goals.length} total</span>
          </div>

          {loading ? (
            <p>Loading savings goals...</p>
          ) : goals.length === 0 ? (
            <p>No savings goals found.</p>
          ) : (
            goals.map((goal) => {

              const percent = calculatePercent(
                goal.currentAmount,
                goal.targetAmount
              )

              const completed =
                goal.status === 'COMPLETED'

              return (
                <div
                  className="goal-card"
                  key={goal.id}
                >

                  <div className="goal-card-header">

                    <strong>
                      {goal.goalName}
                    </strong>

                    <span
                      className={`goal-status goal-status-${String(
                        goal.status
                      ).toLowerCase()}`}
                    >
                      {goal.status}
                    </span>

                  </div>

                  <div className="goal-progress-bar">

                    <div
                      className="goal-progress-fill"
                      style={{
                        width: `${percent}%`
                      }}
                    />

                  </div>

                  <div className="goal-progress-meta">

                    <small>
                      {formatAmount(goal.currentAmount)} of{' '}
                      {formatAmount(goal.targetAmount)}
                    </small>

                    <small>
                      {percent}%
                    </small>

                  </div>

                  {goal.deadline && (
                    <small className="goal-deadline">
                      Target date: {goal.deadline}
                    </small>
                  )}

                  {!completed && (
                    <div className="contribution-box">

                      <input
                        type="number"
                        min="1"
                        placeholder="Contribution amount"
                        value={contributionAmounts[goal.id] || ''}
                        onChange={(e) =>
                          setContributionAmounts((current) => ({
                            ...current,
                            [goal.id]: e.target.value
                          }))
                        }
                      />

                      <button
                        type="button"
                        className="save-button"
                        onClick={() =>
                          handleContribution(goal.id)
                        }
                      >
                        Add Contribution
                      </button>

                    </div>
                  )}

                  {completed && (
                    <p className="goal-completed">
                      ✓ Goal completed
                    </p>
                  )}

                </div>
              )
            })
          )}

        </div>

      </div>

    </section>
  )
}

export default SavingsGoalsPage