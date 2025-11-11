import React, { useMemo, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// --- 1. BUG FIX: Remove getElementAtEvent ---
import { Doughnut } from 'react-chartjs-2';
import { DollarSign } from 'lucide-react';

const chartColors = [
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

const processIncomeData = (transactions) => {
  const incomeCategories = {};

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    if (amount > 0) {
      const category = tx.category || 'Uncategorized';
      if (!incomeCategories[category]) {
        incomeCategories[category] = 0;
      }
      incomeCategories[category] += amount;
    }
  });

  const labels = Object.keys(incomeCategories);
  const data = Object.values(incomeCategories);

  const backgroundColors = labels.map(
    (_, i) => chartColors[i % chartColors.length]
  );

  return { labels, data, backgroundColors };
};

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeChart({ transactions, onCategoryClick }) {
  const chartRef = useRef(null);

  const { labels, data, backgroundColors } = useMemo(
    () => processIncomeData(transactions),
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
    // --- 2. BUG FIX: Corrected onClick handler ---
    onClick: (event, elements) => {
      // 'elements' is an array of clicked items. We just use it directly.
      if (elements.length === 0) {
        return; // User clicked on empty space
      }

      const dataIndex = elements[0].index;
      const categoryLabel = labels[dataIndex]; // Get the label using the index

      if (onCategoryClick) {
        onCategoryClick(categoryLabel);
      }
    },
    onHover: (event, chartElement) => {
      // (This part is correct)
      const canvas = chartRef.current?.canvas;
      if (canvas) {
        canvas.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7281',
          font: { family: 'Inter' },
        },
      },
      title: {
        display: true,
        text: 'Click a slice to see transactions',
        color: '#9ca3af',
        font: {
          size: 12,
          family: 'Inter',
        },
        padding: {
          bottom: 10,
        },
      },
    },
  };

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center">
        <DollarSign className="mr-2 h-6 w-6 text-green-500" />
        Income Breakdown
      </h2>
      <div className="w-full h-96">
        {labels.length > 0 ? (
          <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p>No income data to display.</p>
          </div>
        )}
      </div>
    </section>
  );
}
