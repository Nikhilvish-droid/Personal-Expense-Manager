export const features = [
  {
    title: 'expense management',
    icon: '💸',
    heading: 'Expense Management',
    description: 'Add, edit, delete and organize your daily expenses.',
  },
  {
    title: 'income management',
    icon: '💰',
    heading: 'Income Management',
    description: 'Track salary, freelancing, scholarship and other income.',
  },
  {
    title: 'financial analytics',
    icon: '📊',
    heading: 'Financial Analytics',
    description: 'Understand spending patterns through useful financial insights.',
  },
  {
    title: 'search filter',
    icon: '🗝️',
    heading: 'Saving for goal',
    description: 'Quickly add goal and start contributing money.',
  },
]

export const summaryCards = [
  { icon: '💰', label: 'Total Balance', value: '₹1,08,650', small: 'Available balance' },
  { icon: '📈', label: 'Total Income', value: '₹64,850', small: 'This month' },
  { icon: '💸', label: 'Total Expenses', value: '₹13,270', small: 'This month' },
  { icon: '📊', label: 'Remaining', value: '₹51,580', small: 'Income - Expenses' },
]

export const recentTransactions = [
  {
    icon: '🛒',
    iconClass: 'expense-icon',
    title: 'Grocery Run',
    meta: 'Today • Card',
    amount: '- ₹687',
    amountClass: 'amount-expense',
  },
  {
    icon: '💼',
    iconClass: 'income-icon',
    title: 'Freelance payment',
    meta: 'Yesterday • Bank',
    amount: '+ ₹4,200',
    amountClass: 'amount-income',
  },
  {
    icon: '🚌',
    iconClass: 'expense-icon',
    title: 'Metro recharge',
    meta: '2 days ago • Card',
    amount: '- ₹500',
    amountClass: 'amount-expense',
  },
]

export const transactions = [
  {
    description: 'Chai and samosa',
    category: 'Food',
    date: '20 Sep 2026',
    payment: 'Cash',
    amount: '- ₹45',
    dataCategory: 'food',
    dataType: 'expense',
    dataPayment: 'cash',
  },
  {
    description: 'Metro recharge',
    category: 'Transport',
    date: '19 Sep 2026',
    payment: 'Card',
    amount: '- ₹500',
    dataCategory: 'transport',
    dataType: 'expense',
    dataPayment: 'card',
  },
  {
    description: 'New earphones',
    category: 'Shopping',
    date: '19 Sep 2026',
    payment: 'UPI',
    amount: '- ₹899',
    dataCategory: 'shopping',
    dataType: 'expense',
    dataPayment: 'upi',
  },
  {
    description: 'Electricity bill',
    category: 'Bills',
    date: '18 Sep 2026',
    payment: 'UPI',
    amount: '- ₹1,240',
    dataCategory: 'bills',
    dataType: 'expense',
    dataPayment: 'upi',
  },
  {
    description: 'Grocery run',
    category: 'Food',
    date: '17 Sep 2026',
    payment: 'Card',
    amount: '- ₹687',
    dataCategory: 'food',
    dataType: 'expense',
    dataPayment: 'card',
  },
  {
    description: 'Cab to campus',
    category: 'Transport',
    date: '16 Sep 2026',
    payment: 'Cash',
    amount: '- ₹180',
    dataCategory: 'transport',
    dataType: 'expense',
    dataPayment: 'cash',
  },
  {
    description: 'Lunch with friends',
    category: 'Food',
    date: '15 Sep 2026',
    payment: 'UPI',
    amount: '- ₹320',
    dataCategory: 'food',
    dataType: 'expense',
    dataPayment: 'upi',
  },
]

export const incomeHistory = [
  {
    icon: '💼',
    title: 'Salary',
    date: '01 Sep 2026',
    amount: '+ ₹42,000',
  },
  {
    icon: '🧑‍💻',
    title: 'Freelance project',
    date: '10 Sep 2026',
    amount: '+ ₹8,500',
  },
  {
    icon: '🎓',
    title: 'Scholarship',
    date: '15 Sep 2026',
    amount: '+ ₹6,000',
  },
  {
    icon: '📚',
    title: 'Sold old textbooks',
    date: '18 Sep 2026',
    amount: '+ ₹1,350',
  },
]

export const savingsGoals = [
  { name: 'New Laptop', target: 60000, current: 34500, deadline: '15 Dec 2026', status: 'ACTIVE' },
  { name: 'Goa Trip', target: 15000, current: 15000, deadline: '01 Oct 2026', status: 'COMPLETED' },
  { name: 'Emergency Fund', target: 25000, current: 9200, deadline: '31 Mar 2027', status: 'ACTIVE' },
]

export const categoryExpenses = [
  { label: 'Food', amount: 5420 },
  { label: 'Shopping', amount: 3760 },
  { label: 'Transport', amount: 2380 },
  { label: 'Bills', amount: 1710 },
]

export const paymentMethods = [
  { label: 'UPI', amount: 6500 },
  { label: 'Card', amount: 4200 },
  { label: 'Cash', amount: 2570 },
]

export const monthlyExpenseTrend = [
  { month: 'May', amount: 9800 },
  { month: 'Jun', amount: 11200 },
  { month: 'Jul', amount: 9450 },
  { month: 'Aug', amount: 14300 },
  { month: 'Sep', amount: 13270 },
]

export const incomeExpenseSummary = { income: 64850, expenses: 13270 }
