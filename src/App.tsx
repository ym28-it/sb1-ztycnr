import React, { useState, useEffect } from 'react';
import TransactionPage from './components/TransactionPage';
import GraphPage from './components/GraphPage';
import { Transaction } from './types';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<'transactions' | 'graphs'>('transactions');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Household Accounts</h1>
        
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage('transactions')}
            className={`px-4 py-2 rounded ${currentPage === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Transactions
          </button>
          <button
            onClick={() => setCurrentPage('graphs')}
            className={`px-4 py-2 rounded ${currentPage === 'graphs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Graphs
          </button>
        </div>

        {currentPage === 'transactions' ? (
          <TransactionPage
            transactions={transactions}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
          />
        ) : (
          <GraphPage transactions={transactions} />
        )}
      </div>
    </div>
  );
};

export default App;