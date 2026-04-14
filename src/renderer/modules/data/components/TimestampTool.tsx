import React, { useState, useEffect } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { timestampToDate, dateToTimestamp } from '../utils/timestamp';

const TimestampTool: React.FC = () => {
  const { toolStates, setToolState } = useDataStore();
  const { input, output, operation, format } = toolStates.timestamp;

  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setToolState('timestamp', { input: e.target.value });
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToolState('timestamp', { operation: e.target.value });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToolState('timestamp', { format: e.target.value });
  };

  const handleConvert = () => {
    try {
      setError('');
      let result = '';

      if (operation === 'timestampToDate') {
        result = timestampToDate(input, format);
      } else if (operation === 'dateToTimestamp') {
        const { seconds, milliseconds } = dateToTimestamp(input);
        result = `Seconds: ${seconds}\nMilliseconds: ${milliseconds}`;
      }

      setToolState('timestamp', { output: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {operation === 'timestampToDate' ? 'Timestamp' : 'Date Time'}
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={input}
          onChange={handleInputChange}
          placeholder={operation === 'timestampToDate' ? 'Enter timestamp (seconds or milliseconds)' : 'Enter date time'}
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
            <option value="timestampToDate">Timestamp → Date Time</option>
            <option value="dateToTimestamp">Date Time → Timestamp</option>
          </select>
        </div>

        {operation === 'timestampToDate' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={format}
              onChange={handleFormatChange}
            >
              <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
              <option value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleConvert}
        >
          Convert
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={output}
          readOnly
        />
        {output && (
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

export default TimestampTool;
