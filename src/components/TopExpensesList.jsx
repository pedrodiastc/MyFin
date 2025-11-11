import React, { useMemo } from 'react';
import { TrendingDown } from 'lucide-react'; // Icon for expenses

export default function TopExpensesList({ transactions }) {

  // 1. Memoized calculation to find the top 5 expenses
  const topExpenses = useMemo(() => {
    return transactions
      .filter(tx => tx.amount < 0) // Get only expenses
      .sort((a, b) => a.amount - b.amount) // Sort by amount (e.g., -500, -100, -1)
      .slice(0, 5); // Get just the top 5
  }, [transactions]);

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
        {/* Using text-red-500 to emphasize expenses */}
        <TrendingDown className="mr-2 h-6 w-6 text-red-500" />
        Top 5 Largest Expenses
      </h2>
      
      {/* 2. Render the list or a message if no expenses */}
      {topExpenses.length === 0 ? (
        <p className="text-text-secondary">No expenses recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {topExpenses.map(tx => (
            <li 
              key={tx.id} 
              className="flex justify-between items-center text-text-primary p-2 rounded-md hover:bg-background"
            >
              <div className="flex-grow truncate pr-4">
                <span className="font-medium">{tx.details}</span>
                <span className="block text-sm text-text-secondary">{tx.date}</span>
              </div>
              <span className="font-bold text-red-600 ml-4">
                {/* Format the negative number cleanly */}
                -${Math.abs(tx.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
