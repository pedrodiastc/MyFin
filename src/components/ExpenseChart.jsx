import React, { useRef } from 'react'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';
import { chartColors } from '../utils/dataUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- 3. Accept onCategoryClick prop ---
function ExpenseChart({ categories, onCategoryClick }) {
  // --- 4. Create chartRef ---
  const chartRef = useRef(null);

  const chartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: categories.map(
          (_, i) => chartColors[i % chartColors.length]
        ),
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // --- 5. Add corrected onClick handler ---
    onClick: (event, elements) => {
      // Use the 'elements' array directly (this is the bug fix)
      if (elements.length === 0) {
        return;
      }

      const dataIndex = elements[0].index;
      const categoryLabel = chartData.labels[dataIndex];

      if (onCategoryClick) {
        onCategoryClick(categoryLabel);
      }
    },
    // --- 6. Add onHover for pointer cursor ---
    onHover: (event, chartElement) => {
      const canvas = chartRef.current?.canvas;
      if (canvas) {
        canvas.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter' }, color: '#6b7281' },
      },
      // --- 7. Add subtitle ---
      title: {
        display: true,
        text: 'Click a slice to see transactions',
        color: '#9ca3af', // text-gray-400
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
        <PieChart className="mr-2 h-6 w-6 text-primary-600" />
        Expense Breakdown
      </h2>
      <div className="w-full h-96">
        {/* --- 8. Add ref to Doughnut component --- */}
        <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}

export default ExpenseChart;
