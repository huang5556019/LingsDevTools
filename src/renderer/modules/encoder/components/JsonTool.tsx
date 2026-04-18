import React, { useState, useEffect } from 'react';
import { useEncoderStore } from '../../../store/encoderStore';
import { useHistoryStore } from '../../../store';
import { jsonFormat, jsonCompress } from '../utils/json';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

const JsonTool: React.FC = () => {
  const { setToolState, getToolState } = useEncoderStore();
  const { saveHistory } = useHistoryStore();
  const toolState = getToolState('json');
  const [input, setInput] = useState(toolState.input);
  const [output, setOutput] = useState(toolState.output);
  const [operation, setOperation] = useState(toolState.operation);
  const [error, setError] = useState(toolState.error);

  useEffect(() => {
    setToolState('json', { input, output, operation, error });
  }, [input, output, operation, error, setToolState]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleOperation = async () => {
    try {
      setError('');
      if (!input.trim()) {
        setError('请输入要处理的 JSON');
        return;
      }

      setLoading(true);
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      let result: string;
      if (operation === 'format') {
        result = jsonFormat(input);
      } else {
        result = jsonCompress(input);
      }

      setOutput(result);
      setSuccess('操作成功！');
      // 3秒后自动关闭成功提示
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setSuccess('复制成功！');
      // 3秒后自动关闭成功提示
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('复制失败，请手动复制');
    }
  };

  const handleSave = async () => {
    if (!input.trim()) {
      setError('请输入要处理的 JSON');
      return;
    }
    await saveHistory({
      tool_type: 'json',
      input: JSON.stringify({ input, action: operation }),
      output: output,
    });
    setSuccess('保存成功！');
    // 3秒后自动关闭成功提示
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <label className="block mb-2 font-medium">操作类型</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="format">格式化</option>
          <option value="compress">压缩</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">输入</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="请输入要处理的 JSON"
        />
      </div>

      <button
        onClick={handleOperation}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4 flex items-center gap-2"
        disabled={loading}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {operation === 'format' ? '格式化' : '压缩'}
      </button>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
        />
      )}
      {success && (
        <SuccessMessage
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">输出</label>
        <textarea
          value={output}
          readOnly
          className="w-full p-2 border rounded h-32"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          复制结果
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          保存到历史
        </button>
      </div>
    </div>
  );
};

export default JsonTool;
