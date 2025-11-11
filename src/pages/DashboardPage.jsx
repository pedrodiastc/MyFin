import React, { useMemo } from 'react';
import { aggregateData } from '../utils/dataUtils';
import SummaryCards from '../components/SummaryCards';
import AiInsights from '../components/AiInsights';
import ExpenseChart from '../components/ExpenseChart';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import SpendingByTypeChart from '../components/SpendingByTypeChart';
import TopExpensesList from '../components/TopExpensesList';
import IncomeChart from '../components/IncomeChart';
import ExpensePredictions from '../components/ExpensePredictions';

function DashboardPage({ transactions, onCategoryDrilldown }) {
  const { totals, categories } = useMemo(
    () => aggregateData(transactions),
    [transactions]
  );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-text-primary">Dashboard</h1>

      {transactions.length > 0 ? (
        <>
          <SummaryCards totals={totals} />
          <MonthlyTrendChart transactions={transactions} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpenseChart 
              categories={categories} 
              onCategoryClick={onCategoryDrilldown} 
            />
            <IncomeChart 
              transactions={transactions} 
              onCategoryClick={onCategoryDrilldown} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AiInsights transactions={transactions} categories={categories} />
            <ExpensePredictions transactions={transactions} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopExpensesList transactions={transactions} />
            <SpendingByTypeChart transactions={transactions} />
          </div>
        </>
      ) : (
        <div className="bg-card p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold text-text-primary">
            No Data Loaded
          </h2>
          <p className="mt-2 text-text-secondary">
            Please go to the "Transactions" page to upload your JSON file or add
            one manually.
          </p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
