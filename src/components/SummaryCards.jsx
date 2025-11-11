import React from 'react';

// The component function
function SummaryCards({ totals }) {
  const netBalance = totals.income - totals.expense;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-5 rounded-lg shadow border-b-4 border-green-500">
        <p className="text-sm text-text-secondary">Total Income</p>
        <p className="text-3xl font-bold text-green-600 mt-1">
          ${totals.income.toFixed(2)}
        </p>
      </div>
      <div className="bg-card p-5 rounded-lg shadow border-b-4 border-red-500">
        <p className="text-sm text-text-secondary">Total Expenses</p>
        <p className="text-3xl font-bold text-red-600 mt-1">
          ${totals.expense.toFixed(2)}
        </p>
      </div>
      <div className="bg-card p-5 rounded-lg shadow border-b-4 border-primary-500">
        <p className="text-sm text-text-secondary">Net Balance</p>
        <p
          className={`text-3xl font-bold ${
            netBalance >= 0 ? 'text-primary-700' : 'text-red-600'
          } mt-1`}
        >
          ${netBalance.toFixed(2)}
        </p>
      </div>
    </section>
  );
}

export default SummaryCards;
