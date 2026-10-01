import { useEffect, useState } from 'react'

function ExpenseForm({
  user,
  expense,
  onClose,
  onExpenseAdded,
  categories
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [payment, setPayment] = useState('UPI')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (expense) {
      setDescription(expense.description || '')
      setAmount(expense.amount || '')
      setCategoryId(expense.categoryId || '')
      setDate(expense.transactionDate || '')
      setPayment(expense.paymentMethod || 'UPI')
    } else {
      setDescription('')
      setAmount('')
      setCategoryId(categories?.[0]?.id || '')
      setDate(new Date().toISOString().split('T')[0])
      setPayment('UPI')
    }
  }, [expense, categories])

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
      type: 'EXPENSE',
      amount: Number(amount),
      description,
      source: 'Manual',
      paymentMethod: payment,
      transactionDate: date
    }

    try {
      const url = expense
        ? `http://localhost:8082/api/transactions/${expense.id}`
        : 'http://localhost:8082/api/transactions'

      const response = await fetch(url, {
        method: expense ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to save expense.')
        return
      }

      alert(
        expense
          ? 'Expense updated successfully.'
          : 'Expense added successfully.'
      )

      onExpenseAdded(data)
      onClose()

    } catch (error) {
      console.error('Save expense error:', error)
      alert('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="expense-form"
      className="form-section"
      style={{ display: 'block' }}
    >
      <div className="form-box">

        <div className="form-header">
          <div>
            <p>EXPENSE</p>

            <h2>
              {expense ? 'Edit Expense' : 'Add New Expense'}
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

          <label>Expense Description</label>

          <input
            type="text"
            placeholder="e.g. Grocery shopping"
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
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>
          </select>

          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : expense
                ? 'Update Expense'
                : 'Save Expense'}
          </button>

        </form>

      </div>
    </section>
  )
}

export default ExpenseForm