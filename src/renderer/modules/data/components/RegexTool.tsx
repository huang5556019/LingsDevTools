import React, { useState, useEffect } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { testRegex, replaceRegex, highlightMatches } from '../utils/regex';
import ErrorMessage from '../../../components/ErrorMessage';

const RegexTool: React.FC = () => {
  const { toolStates, setToolState } = useDataStore();
  const { pattern, testText, replacement, flags, matches, result, error } = toolStates.regex;
  const [operation, setOperation] = useState<'match' | 'replace'>('match');

  // Handle real-time updates for matching
  useEffect(() => {
    if (operation === 'match' && pattern && testText) {
      try {
        setToolState('regex', { error: '' });
        const matchResults = testRegex(pattern, testText, flags);
        setToolState('regex', { matches: matchResults.matches, result: '' });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setToolState('regex', { error: errorMessage });
      }
    }
  }, [pattern, testText, flags, operation, setToolState]);

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolState('regex', { pattern: e.target.value });
  };

  const handleTestTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setToolState('regex', { testText: e.target.value });
  };

  const handleReplacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolState('regex', { replacement: e.target.value });
  };

  const handleFlagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolState('regex', { flags: e.target.value });
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value as 'match' | 'replace');
  };

  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    try {
      setToolState('regex', { error: '' });
      setLoading(true);
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      let result = '';

      if (operation === 'match') {
        const matchResults = testRegex(pattern, testText, flags);
        setToolState('regex', { matches: matchResults.matches, result: '' });
      } else if (operation === 'replace') {
        result = replaceRegex(pattern, testText, replacement, flags);
        setToolState('regex', { result, matches: [] });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setToolState('regex', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      let textToCopy = '';
      if (operation === 'match' && matches.length > 0) {
        textToCopy = matches.map(m => m.text).join('\n');
      } else if (operation === 'replace') {
        textToCopy = result;
      }

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        alert('Copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Regular Expression Pattern
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pattern}
          onChange={handlePatternChange}
          placeholder="Enter regex pattern"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={operation}
            onChange={handleOperationChange}
          >
            <option value="match">Match</option>
            <option value="replace">Replace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flags</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={flags}
            onChange={handleFlagsChange}
            placeholder="e.g. g, gi, gm"
          />
        </div>
      </div>

      {operation === 'replace' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Replacement Text
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={replacement}
            onChange={handleReplacementChange}
            placeholder="Enter replacement text"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test Text
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={testText}
          onChange={handleTestTextChange}
          placeholder="Enter text to test against"
        />
      </div>

      <div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          onClick={handleExecute}
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {operation === 'match' ? 'Match' : 'Replace'}
        </button>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setToolState('regex', { error: '' })}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {operation === 'match' ? 'Matches' : 'Result'}
        </label>
        {operation === 'match' ? (
          <div className="space-y-2">
            {matches.length === 0 ? (
              <div className="p-2 bg-gray-100 text-gray-700 rounded-md">
                No matches found
              </div>
            ) : (
              <div>
                <div className="p-2 border border-gray-300 rounded-md mb-2">
                  <div dangerouslySetInnerHTML={{ __html: highlightMatches(testText, matches) }} />
                </div>
                <div className="text-sm text-gray-600">
                  Found {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </div>
              </div>
            )}
          </div>
        ) : (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={result}
            readOnly
          />
        )}
        {((operation === 'match' && matches.length > 0) || (operation === 'replace' && result)) && (
          <button
            className="mt-2 px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleCopy}
          >
            Copy Result
          </button>
        )}
      </div>
    </div>
  );
};

export default RegexTool;
