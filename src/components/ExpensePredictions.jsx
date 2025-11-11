import React, { useMemo } from 'react';
// Import our new utility function
import { generateExpensePredictions } from '../utils/dataUtils';
import { Zap } from 'lucide-react'; // Icon for "smart" features

export default function ExpensePredictions({ transactions }) {
  // Process transactions to get predictions
  const predictions = useMemo(
    () => generateExpensePredictions(transactions),
    [transactions]
  );

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
        <Zap className="mr-2 h-6 w-6 text-primary-600" />
        Spending Forecast
      </h2>
      <div className="w-full">
        {/* Check if we have enough data to show predictions */}
        {predictions.length > 0 ? (
          <ul className="space-y-3">
            <p className="text-sm text-text-secondary mb-3">
              Based on your last 3 months of variable spending, you'll likely
              spend about:
            </p>
            {predictions.map((pred) => (
              <li
                key={pred.category}
                className="flex justify-between items-center text-text-primary p-2 rounded-md hover:bg-background"
              >
                <span className="font-medium">{pred.category}</span>
                <span className="font-bold text-primary-700 ml-4">
                  ~${pred.average.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p>
              Not enough data from the last 3 months to make a prediction. Keep
              adding transactions!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
