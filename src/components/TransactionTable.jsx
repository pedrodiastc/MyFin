import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

// ... (getTransactionTypeInfo function is unchanged) ...
const getTransactionTypeInfo = (type) => {
  switch (type) {
    case 'Income':
      return { abbreviation: 'INC', title: 'Income' };
    case 'Fixed':
      return { abbreviation: 'FIX', title: 'Fixed Expense' };
    case 'Not Fixed':
      return { abbreviation: 'VAR', title: 'Variable Expense' }; // VAR is more common than NFX
    case 'Not Applicable':
      return { abbreviation: 'N/A', title: 'Not Applicable' };
    default:
      return { abbreviation: 'UNK', title: 'Unknown' }; // Unknown/Uncategorized
  }
};

function TransactionTable({ transactions, onEdit, onAdd }) {
  // ... (sortedTransactions is unchanged) ...
  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      {/* ... (header is unchanged) ... */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-text-primary">
          Detailed Transactions
        </h2>
        <button
          onClick={onAdd}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center"
        >
          <Plus className="mr-1 h-5 w-5" />
          Add Transaction
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-background">
            <tr>
              {/* ... (table headers are unchanged) ... */}
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody
            id="transactionTableBody"
            className="bg-card divide-y divide-gray-200"
          >
            {sortedTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-text-secondary"
                >
                  No transactions to display.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => {
                const amount = parseFloat(tx.amount) || 0;
                const isExpense = amount < 0;

                const { abbreviation, title } = getTransactionTypeInfo(tx.type);

                return (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {/* This date formatting is fine, but the YYYY-MM-DD format 
                        from Python will also display cleanly.
                      */}
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        timeZone: 'UTC', // Use UTC to prevent off-by-one day errors
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td
                      className="px-6 py-4 text-sm font-medium text-text-primary max-w-xs truncate"
                      title={tx.details}
                    >
                      {tx.details}
                    </td>

                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        isExpense ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {isExpense ? '-' : '+'}${Math.abs(amount).toFixed(2)}
                    </td>

                    {/* --- 1. UPDATED CATEGORY CELL (Request #1) --- */}
                    {/* Truncates long category names to save space, 
                      and shows the full name on hover.
                    */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-text-accent max-w-[150px] truncate"
                      title={tx.category}
                    >
                      {tx.category}
                    </td>

                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-medium"
                      title={title}
                    >
                      {abbreviation}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit(tx)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TransactionTable;
