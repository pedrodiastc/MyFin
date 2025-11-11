import React, { useState, useEffect } from 'react';
// --- 1. Import icons: Info and FileWarning ---
import {
  Settings,
  Download,
  AlertTriangle,
  FileText,
  Info,
  FileWarning,
} from 'lucide-react';

export default function SettingsPage() {
  const [rulesText, setRulesText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/rules.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not fetch rules.json: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setRulesText(JSON.stringify(data, null, 2));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load rules:', err);
        setError(
          'Could not load rules.json. Make sure it is in your /public folder.'
        );
        setIsLoading(false);
      });
  }, []);

  // --- 2. UPDATED handleDownload function ---
  const handleDownload = () => {
    try {
      // First, check if the text is valid JSON
      JSON.parse(rulesText);
      // If it's valid, clear any old errors
      setError(null);
    } catch (e) {
      // If it's invalid, set a user-friendly error and stop
      setError(`JSON SYNTAX ERROR: ${e.message}. Please fix it before saving.`);
      return;
    }

    const blob = new Blob([rulesText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-text-primary flex items-center">
        <Settings className="mr-3 h-10 w-10" />
        Settings
      </h1>

      {/* --- 3. NEW "HOW IT WORKS" CARD --- */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-text-primary flex items-center">
          <Info className="mr-2 h-6 w-6 text-blue-500" />
          How The Rules Work
        </h2>
        <div className="mt-4 text-text-secondary space-y-4">
          <p>
            Your <code>rules.json</code> file is the "brain" for the Python
            script. It's a simple list of instructions that run every time you
            convert your PDF.
          </p>
          <p>The file is split into two main arrays:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <code>"income_rules"</code>: Used to categorize your{' '}
              <strong>positive</strong> transactions (e.g., salary and any extra income).
            </li>
            <li>
              <code>"expense_rules"</code>: Used to categorize your{' '}
              <strong>negative</strong> transactions (e.g., transportation, groceries, rent).
            </li>
          </ul>
          <p>Each rule in these lists has 3 parts:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2">
            <li>
              <strong>
                <code>"keyword"</code>
              </strong>
              : The unique text the script searches for in your bank statement
              (e.g., <code>"COMPANY NAME / SALARY"</code> or{' '}
              <code>"UBER *EATS"</code>).
            </li>
            <li>
              <strong>
                <code>"category"</code>
              </strong>
              : The custom category you want to assign (e.g.,{' '}
              <code>"Income/Salary"</code> or <code>"Food & Dining"</code>).
              This will appear on your dashboard charts.
            </li>
            <li>
              <strong>
                <code>"type"</code>
              </strong>
              : The transaction type (e.g., <code>"Fixed"</code>,{' '}
              <code>"Not Fixed"</code>, or <code>"Income"</code>). This is used
              for the "Spending by Type" chart.
            </li>
          </ol>

          <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-text-primary">
                Where to Save This File
              </h3>
              <p>
                After you click "Save & Download", you **must** move the new{' '}
                <code>rules.json</code> file from your computer's "Downloads"
                folder into the **same folder** as your{' '}
                <code>pdf_to_json_converter.py</code> script, replacing the old rules.json
                file.
              </p>
            </div>
          </div>
        </div>
      </div>

          {/* --- The Tutorial Card --- */}
          <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-text-primary">
          How to Update Your Rules
        </h2>
        <div className="mt-4 text-text-secondary space-y-4">
          <div className="flex items-start p-4 bg-background rounded-lg">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-text-primary">
                Important: 2-Step Process
              </h3>
              <p>
                This app runs 100% offline. Because of browser security, the app
                **cannot** save the file directly to your computer.
              </p>
            </div>
          </div>

          <ol className="list-decimal list-inside space-y-2">
            <li>
              Make your edits to the text in the editor above. (Make sure you
              use valid JSON syntax!)
            </li>
            <li>Click the **"Save & Download rules.json"** button.</li>
            <li>Your browser will download the new `rules.json` file.</li>
            <li>
              Find the downloaded file and **move it** into your Python script
              folder, replacing the old `rules.json` file.
            </li>
            <li>
              The next time you run the `pdf_to_json_converter.py` script, it
              will use your new rules!
            </li>
          </ol>
        </div>
      </div>

      {/* --- The Editor Card --- */}
      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-text-primary flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Categorization Rules Editor (`rules.json`)
          </h2>
          <button
            onClick={handleDownload}
            disabled={isLoading} // Allow download even if there was a load error
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center disabled:opacity-50"
          >
            <Download className="mr-2 h-5 w-5" />
            Save & Download rules.json
          </button>
        </div>

        {/* --- The Text Area (Editor) --- */}
        {isLoading && (
          <div className="text-text-secondary">Loading rules template...</div>
        )}

        {/* --- 4. NEW ERROR DISPLAY BLOCK --- */}
        {error && (
          <div className="flex items-center p-4 mb-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
            <FileWarning className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!isLoading && (
          <textarea
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            // Show a red border if there's an error
            className={`
              w-full h-96 p-4 font-mono text-sm border rounded-md 
              focus:ring-primary-500 focus:border-primary-500
              ${error ? 'border-red-500' : 'border-gray-300'}
            `}
            spellCheck="false"
          />
        )}
      </div>

  
    </div>
  );
}
