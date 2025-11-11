import React, { useState } from 'react';
import { Upload } from 'lucide-react';

// This component is now simplified. It doesn't need any rules
// because the Python script has already done all the categorization.

function Uploader({ onDataLoaded }) {
  const [message, setMessage] = useState(
    'Waiting for your "financial_data.json" file...'
  );
  const [messageColor, setMessageColor] = useState('text-yellow-600');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // 1. Just parse the JSON
        const transactions = JSON.parse(e.target.result);

        // 2. Map transactions to ensure they have a unique ID
        const transactionsWithIds = transactions.map((tx, index) => ({
          ...tx,
          id: tx.id || Date.now() + index, // Use existing ID or create one
        }));

        // 3. Load the data
        onDataLoaded(transactionsWithIds);
        setMessage(
          `✅ Success! ${transactions.length} categorized transactions loaded.`
        );
        setMessageColor('text-green-600');
      } catch (err) {
        setMessage(
          `❌ Error: Could not parse JSON file. Ensure it's the file from the Python script.`
        );
        setMessageColor('text-red-600');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="bg-card p-6 rounded-lg shadow border-l-4 border-primary-500">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
        <Upload className="mr-2 h-5 w-5 text-primary-600" />
        Upload your 'financial_data.json'
      </h2>
      <input
        type="file"
        id="jsonFileInput"
        accept=".json"
        onChange={handleFileChange}
        className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
      />
      <p id="data-status-message" className={`text-sm ${messageColor} mt-4`}>
        {message}
      </p>
    </section>
  );
}
export default Uploader;
