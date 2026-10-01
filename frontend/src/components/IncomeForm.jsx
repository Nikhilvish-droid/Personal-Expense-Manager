import { useEffect, useState } from 'react'

function IncomeForm({
  user,
  income,
  onClose,
  onIncomeAdded,
  categories
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [payment, setPayment] = useState('BANK_TRANSFER')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (income) {
      setDescription(income.description || '')
      setAmount(income.amount || '')
      setCategoryId(income.categoryId || '')
      setDate(income.transactionDate || '')
      setPayment(income.paymentMethod || 'BANK_TRANSFER')
    } else {
      setDescription('')
      setAmount('')
      setCategoryId(categories?.[0]?.id || '')
      setDate(new Date().toISOString().split('T')[0])
      setPayment('BANK_TRANSFER')
    }
  }, [income, categories])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!user?.userId) {
      alert('User not found. Please login again.')
      return
    }

    if (!categoryId) {
      alert('Please select a category.')
      return
    }

    setLoading(true)

    const transactionData = {
      userId: user.userId,
      categoryId: Number(categoryId),
      type: 'INCOME',
      amount: Number(amount),
      description,
      source: 'Manual',
      paymentMethod: payment,
      transactionDate: date
    }

    try {
      const url = income
        ? `http://localhost:8082/api/transactions/${income.id}`
        : 'http://localhost:8082/api/transactions'

      const response = await fetch(url, {
        method: income ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to save income.')
        return
      }

      alert(
        income
          ? 'Income updated successfully.'
          : 'Income added successfully.'
      )

      onIncomeAdded(data)
      onClose()

    } catch (error) {
      console.error('Save income error:', error)
      alert('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="income-form"
      className="form-section"
      style={{ display: 'block' }}
    >
      <div className="form-box">

        <div className="form-header">
          <div>
            <p>INCOME</p>
            <h2>
              {income ? 'Edit Income' : 'Add New Income'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="close-form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Income Description</label>

          <input
            type="text"
            placeholder="e.g. Monthly salary"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Amount</label>

          <input
            type="number"
            placeholder="Enter amount"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Category</label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <label>Date</label>

          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Payment Method</label>

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>
            <option value="UPI">
              UPI
            </option>
            <option value="CASH">
              Cash
            </option>
            <option value="CARD">
              Card
            </option>
          </select>

          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : income
                ? 'Update Income'
                : 'Save Income'}
          </button>

        </form>

      </div>
    </section>
  )
}

export default IncomeForm