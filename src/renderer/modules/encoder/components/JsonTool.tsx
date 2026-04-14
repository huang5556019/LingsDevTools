import React, { useState, useEffect } from 'react';
import { useEncoderStore } from '../../store/encoderStore';
import { jsonFormat, jsonCompress } from '../utils/json';

const JsonTool: React.FC = () => {
  const { toolStates, setToolState, getToolState } = useEncoderStore();
  const toolState = getToolState('json');
  const [input, setInput] = useState(toolState.input);
  const [output, setOutput] = useState(toolState.output);
  const [operation, setOperation] = useState(toolState.operation);
  const [error, setError] = useState(toolState.error);

  useEffect(() => {
    setToolState('json', { input, output, operation, error });
  }, [input, output, operation, error, setToolState]);

  const handleOperation = () => {
    try {
      setError('');
      if (!input.trim()) {
        setError('请输入要处理的 JSON');
        return;
      }

      let result: string;
      if (operation === 'format') {
        result = jsonFormat(input);
      } else {
        result = jsonCompress(input);
      }

      setOutput(result);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('复制成功！');
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  const handleSave = () => {
    // 这里可以集成历史记录保存功能
    console.log('保存到历史记录:', { input, output, operation });
    alert('保存成功！');
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
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        {operation === 'format' ? '格式化' : '压缩'}
      </button>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
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
