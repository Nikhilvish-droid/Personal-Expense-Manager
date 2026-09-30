import { transactions } from '../data/sampleData'
import ExpenseForm from '../components/ExpenseForm'

function ExpensesPage({ isExpenseFormOpen, onOpenExpenseForm, onCloseExpenseForm }) {
  return (
    <section id="expenses" className="expenses-section">
      <div className="section-heading">
        <p>EXPENSE MANAGEMENT</p>
        <h2>Manage Your Expenses</h2>
        <span>Keep your spending organized in one place.</span>
      </div>

      <div className="filter-container">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7b8782" strokeWidth="1.5">
            <circle cx="7" cy="7" r="5.5" />
            <line x1="11.2" y1="11.2" x2="15" y2="15" strokeLinecap="round" />
          </svg>
          <input type="text" placeholder="Search transactions..." />
        </div>
        <select>
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
        </select>
        <select>
          <option value="all">All Transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select>
          <option value="all">All Payment Methods</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
        <button className="add-button" onClick={onOpenExpenseForm}>+ Add Expense</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.description}
                data-category={tx.dataCategory}
                data-type={tx.dataType}
                data-payment={tx.dataPayment}
              >
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td>{tx.date}</td>
                <td>{tx.payment}</td>
                <td className="amount-expense">{tx.amount}</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isExpenseFormOpen && <ExpenseForm onClose={onCloseExpenseForm} />}
    </section>
  )
}

export default ExpensesPage
