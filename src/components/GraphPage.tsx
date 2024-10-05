import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Transaction, incomeCategories, expenseCategories } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface GraphPageProps {
  transactions: Transaction[];
}

const GraphPage: React.FC<GraphPageProps> = ({ transactions }) => {
  const prepareIncomeExpenseChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const incomeData = last7Days.map(date => 
      transactions.filter(t => t.date === date && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const expenseData = last7Days.map(date => 
      transactions.filter(t => t.date === date && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  };

  const prepareSavingsChartData = () => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeSavings = 0;
    const savingsData = sortedTransactions.map(t => {
      cumulativeSavings += t.type === 'income' ? t.amount : -t.amount;
      return { date: t.date, savings: cumulativeSavings };
    });

    const uniqueDates = Array.from(new Set(savingsData.map(d => d.date))).sort();

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: 'Cumulative Savings',
          data: uniqueDates.map(date => {
            const lastEntryForDate = savingsData.filter(d => d.date === date).pop();
            return lastEntryForDate ? lastEntryForDate.savings : null;
          }),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const prepareCategoryChartData = (type: 'income' | 'expense') => {
    const categoryData = (type === 'income' ? incomeCategories : expenseCategories).map(category => ({
      category,
      amount: transactions
        .filter(t => t.type === type && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)
    }));

    return {
      labels: categoryData.map(d => d.category),
      datasets: [
        {
          data: categoryData.map(d => d.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Income vs Expense (Last 7 Days)',
      },
    },
  };

  const savingsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cumulative Savings Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Savings Amount',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Income vs Expense Graph</h3>
        <Bar options={chartOptions} data={prepareIncomeExpenseChartData()} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Savings Over Time</h3>
        <Line options={savingsChartOptions} data={prepareSavingsChartData()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Income Categories</h3>
          <Pie options={categoryChartOptions} data={prepareCategoryChartData('income')} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Expense Categories</h3>
          <Pie options={categoryChartOptions} data={prepareCategoryChartData('expense')} />
        </div>
      </div>
    </div>
  );
};

export default GraphPage;