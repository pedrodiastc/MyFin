export const aggregateData = (transactions) => {
  let totals = { income: 0, expense: 0 };
  let categories = {};
  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    const absAmount = Math.abs(amount);

    if (amount < 0) {
      // Expenses
      totals.expense += absAmount;
      if (!categories[tx.category]) {
        categories[tx.category] = { total: 0, type: tx.type };
      }
      categories[tx.category].total += absAmount;
    } else {
      // Income
      totals.income += absAmount;
    }
  });

  const sortedCategories = Object.entries(categories)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total);

  return { totals, categories: sortedCategories };
};

export const chartColors = [
  '#4F46E5',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#6366F1',
  '#3B82F6',
  '#EC4899',
  '#06B6D4',
  '#F97316',
  '#14B8A6',
];
// Processes transactions into monthly income vs. expense
export const processMonthlyData = (transactions) => {
  const monthlyData = {};

  transactions.forEach((tx) => {
    try {
      const date = new Date(tx.date);
      // Use toISOString to get a stable 'YYYY-MM' key
      const monthYear = date.toISOString().slice(0, 7);

      if (!monthlyData[monthYear]) {
        // Store the date object for sorting
        monthlyData[monthYear] = {
          income: 0,
          expense: 0,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
        };
      }

      const amount = parseFloat(tx.amount) || 0;
      if (amount > 0) {
        monthlyData[monthYear].income += amount;
      } else {
        // Store expenses as positive numbers for the chart
        monthlyData[monthYear].expense += Math.abs(amount);
      }
    } catch (e) {
      // Log an error if the date is invalid, but don't crash
      console.error('Invalid transaction date:', tx.date, e);
    }
  });

  // Sort all the monthly data by date
  const sortedMonths = Object.values(monthlyData).sort(
    (a, b) => a.date - b.date
  );

  // Format the data for Chart.js
  const labels = sortedMonths.map((data) => {
    // Format date as 'Jan 2023'
    return data.date.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
  });
  const incomeData = sortedMonths.map((data) => data.income);
  const expenseData = sortedMonths.map((data) => data.expense);

  return { labels, incomeData, expenseData };
};
// Processes expenses into Fixed vs. Not Fixed
export const processSpendingByType = (transactions) => {
  const spendingByType = {};

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    // Only count expenses
    if (amount < 0) {
      const type = tx.type || 'Uncategorized'; // Default if type is missing
      if (!spendingByType[type]) {
        spendingByType[type] = 0;
      }
      spendingByType[type] += Math.abs(amount);
    }
  });

  // Format for Chart.js
  const labels = Object.keys(spendingByType);
  const data = Object.values(spendingByType);

  // Use our existing chart colors
  const backgroundColors = labels.map(
    (_, i) => chartColors[i % chartColors.length]
  );

  return { labels, data, backgroundColors };
};

// --- ADD THIS NEW FUNCTION TO THE BOTTOM ---
// Processes income into categories
export const processIncomeData = (transactions) => {
  const incomeCategories = {};

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    // Only count income
    if (amount > 0) {
      const category = tx.category || 'Uncategorized'; // Default if category is missing
      if (!incomeCategories[category]) {
        incomeCategories[category] = 0;
      }
      incomeCategories[category] += amount;
    }
  });

  // Format for Chart.js
  const labels = Object.keys(incomeCategories);
  const data = Object.values(incomeCategories);

  // Use our existing chart colors (can use the same ones)
  const backgroundColors = labels.map(
    (_, i) => chartColors[i % chartColors.length]
  );

  return { labels, data, backgroundColors };
};

// Generates expense predictions based on the last 3 months of data
export const generateExpensePredictions = (transactions) => {
  const predictions = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // 1. Get string representations for the last 3 full months (e.g., "2023-10", "2023-09", "2023-08")
  const relevantMonths = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(currentYear, currentMonth - i, 1);
    relevantMonths.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }

  // 2. Filter transactions to get variable expenses from those 3 months
  const relevantTxs = transactions.filter((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    const type = tx.type || 'Uncategorized';
    const txDate = tx.date ? tx.date.slice(0, 7) : '';

    return (
      amount < 0 && // Is an expense
      type.toLowerCase() === 'not fixed' && // Is variable
      relevantMonths.includes(txDate)
    ); // Is in the last 3 months
  });

  if (relevantTxs.length === 0) {
    return []; // Not enough data
  }

  // 3. Find the top 3 most *frequent* variable categories
  const categoryCounts = relevantTxs.reduce((acc, tx) => {
    const category = tx.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count, descending
    .slice(0, 3) // Get top 3
    .map((entry) => entry[0]); // Just get the names

  if (topCategories.length === 0) {
    return []; // No recurring variable categories
  }

  // 4. Calculate the 3-month average for each top category
  topCategories.forEach((category) => {
    const monthlyTotals = {};

    // Get all spending for this category in the relevant months
    relevantTxs.forEach((tx) => {
      if (tx.category === category) {
        const monthYear = tx.date.slice(0, 7);
        const amount = Math.abs(parseFloat(tx.amount) || 0);
        monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + amount;
      }
    });

    // Calculate the average
    const totals = Object.values(monthlyTotals);
    if (totals.length > 0) {
      const sum = totals.reduce((a, b) => a + b, 0);
      const average = sum / 3; // Divide by 3 months

      predictions.push({
        category: category,
        average: average,
      });
    }
  });

  // 5. Return the sorted list of predictions
  return predictions.sort((a, b) => b.average - a.average);
};
