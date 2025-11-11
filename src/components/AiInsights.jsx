import React, { useState } from 'react';
import { Brain } from 'lucide-react';

export default function AiInsights({ transactions, categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

  // TODO: Move API Key to a .env file
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const API_URL = apiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`
    : '';

  const generateSpendingAnalysis = async () => {
    if (!apiKey) {
      setError(
        'API Key is not set. Please create a .env file with REACT_APP_GEMINI_API_KEY.'
      );
      setAnalysis('');
      return;
    }
    setIsLoading(true);
    setAnalysis('');
    setError('');
    try {
      const expenseCategories = categories.filter((c) => c.type !== 'Income');
      const userQuery = `Analyze this monthly expense breakdown: ${JSON.stringify(
        expenseCategories.map((c) => ({ [c.name]: `$${c.total.toFixed(2)}` }))
      )}. Provide a concise, single-paragraph summary of spending habits, highlight the top 2 expenses, and offer one actionable financial tip based on these habits.`;
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [
            { text: 'You are a friendly, concise personal financial coach.' },
          ],
        },
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.error.message || `API Error: ${response.status}`
        );
      }
      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        setAnalysis(generatedText.replace(/\n/g, '<br>'));
      } else {
        throw new Error('Analysis failed to generate.');
      }
    } catch (err) {
      setError(`Error generating analysis: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
        <Brain className="mr-2 h-6 w-6 text-primary-600" />
        AI Financial Insights
      </h2>

      <button
        id="generateAnalysis"
        onClick={generateSpendingAnalysis}
        disabled={isLoading || transactions.length === 0}
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {isLoading ? (
          <>
            <div className="loading-spinner mr-3"></div>Analyzing...
          </>
        ) : (
          '✨ Generate Spending Analysis'
        )}
      </button>
      {analysis && (
        <div
          id="analysisOutput"
          className="mt-4 p-4 border border-primary-200 rounded-lg bg-primary-50 text-text-primary"
          dangerouslySetInnerHTML={{ __html: analysis }}
        />
      )}
      {error && (
        <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          <b>Error:</b> {error}
        </div>
      )}
    </section>
  );
}
