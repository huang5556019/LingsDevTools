import React from 'react';
import { useNetworkStore } from '../../../store/networkStore';
import { useHistoryStore } from '../../../store';
import { sendHttpRequest } from '../utils/http';
import ErrorMessage from '../../../components/ErrorMessage';

const HttpTool: React.FC = () => {
  const { httpTool, updateHttpTool, addHttpHeader, removeHttpHeader } = useNetworkStore();
  const { saveHistory } = useHistoryStore();

  const handleSend = async () => {
    if (!httpTool.url.trim()) {
      updateHttpTool({ error: '请输入 URL' });
      return;
    }

    updateHttpTool({ loading: true, error: '' });

    try {
      const response = await sendHttpRequest({
        url: httpTool.url,
        method: httpTool.method,
        headers: httpTool.headers,
        body: httpTool.body,
        bodyType: httpTool.bodyType,
      });

      updateHttpTool({ response, loading: false });

      const inputData = {
        url: httpTool.url,
        method: httpTool.method,
        headers: httpTool.headers,
        body: httpTool.body,
        bodyType: httpTool.bodyType,
      };

      const outputData = typeof response.data === 'object'
        ? JSON.stringify(response.data)
        : String(response.data || '');

      await saveHistory({
        tool_type: 'http',
        input: JSON.stringify(inputData),
        output: outputData,
      });
    } catch (error) {
      updateHttpTool({ error: (error as Error).message, loading: false });
    }
  };

  const handleCopy = async () => {
    try {
      const responseText = JSON.stringify(httpTool.response.data, null, 2);
      await navigator.clipboard.writeText(responseText);
      alert('复制成功！');
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  const handleSave = () => {
    // 这里可以集成历史记录保存功能
    console.log('保存到历史记录:', {
      url: httpTool.url,
      method: httpTool.method,
      headers: httpTool.headers,
      body: httpTool.body,
      bodyType: httpTool.bodyType,
      response: httpTool.response,
    });
    alert('保存成功！');
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">URL</label>
          <input
            type="text"
            value={httpTool.url}
            onChange={(e) => updateHttpTool({ url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="请输入请求 URL"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">方法</label>
          <select
            value={httpTool.method}
            onChange={(e) => updateHttpTool({ method: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">请求头</label>
          <button
                onClick={addHttpHeader}
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                添加
              </button>
        </div>
        {httpTool.headers.map((header, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={header.key}
              onChange={(e) => {
                const newHeaders = [...httpTool.headers];
                newHeaders[index].key = e.target.value;
                updateHttpTool({ headers: newHeaders });
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Key"
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => {
                const newHeaders = [...httpTool.headers];
                newHeaders[index].value = e.target.value;
                updateHttpTool({ headers: newHeaders });
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Value"
            />
            <button
              onClick={() => removeHttpHeader(index)}
              className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            >
              删除
            </button>
          </div>
        ))}
      </div>

      {(httpTool.method !== 'GET' && httpTool.method !== 'HEAD') && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">请求体</label>
            <select
              value={httpTool.bodyType}
              onChange={(e) => updateHttpTool({ bodyType: e.target.value as 'json' | 'form' | 'text' })}
              className="p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="json">JSON</option>
              <option value="form">表单数据</option>
              <option value="text">纯文本</option>
            </select>
          </div>
          <textarea
            value={httpTool.body}
            onChange={(e) => updateHttpTool({ body: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={httpTool.bodyType === 'json' ? '{"key": "value"}' : httpTool.bodyType === 'form' ? 'key1=value1&key2=value2' : '请输入文本'}
          />
        </div>
      )}

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4 flex items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        disabled={httpTool.loading}
      >
        {httpTool.loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {httpTool.loading ? '发送中...' : '发送请求'}
      </button>

      {httpTool.error && (
        <ErrorMessage
          message={httpTool.error}
          onClose={() => updateHttpTool({ error: '' })}
        />
      )}

      {httpTool.response.status && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">响应</label>
            <div className="text-sm">
              状态: {httpTool.response.status} {httpTool.response.statusText} | 耗时: {httpTool.response.time}ms
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">响应头</label>
            <pre className="p-2 border rounded bg-gray-50 text-sm overflow-auto max-h-20">
              {Object.entries(httpTool.response.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
            </pre>
          </div>
          <div>
            <label className="block text-sm mb-1">响应体</label>
            <pre className="p-2 border rounded bg-gray-50 text-sm overflow-auto max-h-40">
              {typeof httpTool.response.data === 'object' 
                ? JSON.stringify(httpTool.response.data, null, 2)
                : String(httpTool.response.data)}
            </pre>
          </div>
        </div>
      )}

      {httpTool.response.status && (
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            复制结果
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            保存到历史
          </button>
        </div>
      )}
    </div>
  );
};

export default HttpTool;
