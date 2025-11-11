import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// Import our new utility function
import { processMonthlyData } from '../utils/dataUtils';
import { TrendingUp } from 'lucide-react';

// Register the Chart.js components we're using
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyTrendChart({ transactions }) {
  // Process the raw transactions into monthly data
  const { labels, incomeData, expenseData } = useMemo(
    () => processMonthlyData(transactions),
    [transactions]
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#10B981', // Hardcoded green
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#EF4444', // Hardcoded red
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7281', // text-text-secondary
          font: { family: 'Inter' },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b7281', // text-text-secondary
          font: { family: 'Inter' },
        },
        grid: {
          color: '#e5e7eb', // gray-200
        },
      },
      x: {
        ticks: {
          color: '#6b7281', // text-text-secondary
          font: { family: 'Inter' },
        },
        grid: {
          display: false, // No vertical grid lines
        },
      },
    },
  };

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
        <TrendingUp className="mr-2 h-6 w-6 text-primary-600" />
        Monthly Trends (Income vs. Expense)
      </h2>
      <div className="h-96">
        {' '}
        {/* Set a fixed height for the chart container */}
        <Bar options={options} data={data} />
      </div>
    </section>
  );
}
