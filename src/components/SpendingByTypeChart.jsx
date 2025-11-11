import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
// Import our new utility function
import { processSpendingByType } from '../utils/dataUtils';
import { Target } from 'lucide-react'; // New icon

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendingByTypeChart({ transactions }) {
  // Process the raw transactions into data for this chart
  const { labels, data, backgroundColors } = useMemo(
    () => processSpendingByType(transactions),
    [transactions]
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7281',
          font: { family: 'Inter' },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
        <Target className="mr-2 h-6 w-6 text-primary-600" />
        Spending by Type
      </h2>
      <div className="h-96">
        {' '}
        {/* Set a fixed height for the chart container */}
        <Pie options={chartOptions} data={chartData} />
      </div>
    </section>
  );
}
