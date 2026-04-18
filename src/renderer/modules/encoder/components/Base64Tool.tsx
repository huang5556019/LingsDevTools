import React, { useState, useEffect } from 'react';
import { useEncoderStore } from '../../../store/encoderStore';
import { useHistoryStore } from '../../../store';
import { base64Encode, base64Decode } from '../utils/base64';

const Base64Tool: React.FC = () => {
  const { setToolState, getToolState } = useEncoderStore();
  const { saveHistory } = useHistoryStore();
  const toolState = getToolState('base64');
  const [input, setInput] = useState(toolState.input);
  const [output, setOutput] = useState(toolState.output);
  const [operation, setOperation] = useState(toolState.operation);
  const [error, setError] = useState(toolState.error);

  useEffect(() => {
    setToolState('base64', { input, output, operation, error });
  }, [input, output, operation, error, setToolState]);

  const handleOperation = () => {
    try {
      setError('');
      if (!input.trim()) {
        setError('请输入要处理的文本');
        return;
      }

      let result: string;
      if (operation === 'encode') {
        result = base64Encode(input);
      } else {
        result = base64Decode(input);
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

  const handleSave = async () => {
    if (!input.trim()) {
      alert('请输入要处理的文本');
      return;
    }
    await saveHistory({
      tool_type: 'base64',
      input: JSON.stringify({ input, mode: operation }),
      output: output,
    });
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
          <option value="encode">编码</option>
          <option value="decode">解码</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">输入</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="请输入要处理的文本"
        />
      </div>

      <button
        onClick={handleOperation}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        {operation === 'encode' ? '编码' : '解码'}
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

export default Base64Tool;
