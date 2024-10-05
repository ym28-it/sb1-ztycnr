import React, { useState } from 'react';
import { PlusCircle, Trash2, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Transaction, incomeCategories, expenseCategories } from '../types';

interface TransactionPageProps {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
}

const TransactionPage: React.FC<TransactionPageProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());

  const handleAddTransaction = () => {
    if (description && amount && category) {
      const newTransaction: Transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
      };
      addTransaction(newTransaction);
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date());
    }
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Balance: ${calculateBalance().toFixed(2)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as 'income' | 'expense');
            setCategory(''); // Reset category when type changes
          }}
          className="w-full p-2 border rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {type === 'income'
            ? incomeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            : expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
        </select>
        <div className="relative">
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="w-full p-2 border rounded"
            dateFormat="yyyy-MM-dd"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <button
        onClick={handleAddTransaction}
        className="w-full mb-8 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Transaction
      </button>

      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      {transactions.slice().reverse().map((t) => (
        <div key={t.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
          <div>
            <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
            </span>
            <span className="ml-2">{t.description}</span>
            <span className="ml-2 text-sm text-gray-500">{t.category}</span>
            <span className="ml-2 text-sm text-gray-500">{t.date}</span>
          </div>
          <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionPage;