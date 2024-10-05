export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other Income'
];

export const expenseCategories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Education',
  'Personal',
  'Debt Payments',
  'Savings',
  'Other Expenses'
];