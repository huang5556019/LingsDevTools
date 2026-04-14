import React, { useEffect, useRef } from 'react';
import { useNetworkStore } from '../../../store/networkStore';
import { webSocketClient } from '../utils/websocket';

const WebSocketTool: React.FC = () => {
  const { webSocketTool, updateWebSocketTool, addWebSocketMessage, clearWebSocketMessages } = useNetworkStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 注册 WebSocket 事件处理
    webSocketClient.onOpen = () => {
      updateWebSocketTool({ status: 'connected' });
      addWebSocketMessage({
        id: Date.now().toString(),
        type: 'system',
        content: '连接已建立',
        timestamp: Date.now(),
      });
    };

    webSocketClient.onClose = () => {
      updateWebSocketTool({ status: 'disconnected' });
      addWebSocketMessage({
        id: Date.now().toString(),
        type: 'system',
        content: '连接已断开',
        timestamp: Date.now(),
      });
    };

    webSocketClient.onError = (error) => {
      updateWebSocketTool({ error: error.message });
      addWebSocketMessage({
        id: Date.now().toString(),
        type: 'system',
        content: `错误: ${error.message}`,
        timestamp: Date.now(),
      });
    };

    webSocketClient.onMessage = (message) => {
      addWebSocketMessage({
        id: Date.now().toString(),
        type: 'received',
        content: message,
        timestamp: Date.now(),
      });
    };

    return () => {
      // 清理 WebSocket 连接
      webSocketClient.disconnect();
    };
  }, [updateWebSocketTool, addWebSocketMessage]);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [webSocketTool.messages]);

  const handleConnect = () => {
    if (!webSocketTool.url.trim()) {
      updateWebSocketTool({ error: '请输入 WebSocket URL' });
      return;
    }

    updateWebSocketTool({ status: 'connecting', error: '' });
    webSocketClient.connect(webSocketTool.url);
  };

  const handleDisconnect = () => {
    webSocketClient.disconnect();
    updateWebSocketTool({ status: 'disconnected' });
  };

  const handleSend = () => {
    if (!webSocketTool.messageInput.trim()) {
      updateWebSocketTool({ error: '请输入消息内容' });
      return;
    }

    try {
      let messageToSend = webSocketTool.messageInput;
      if (webSocketTool.messageType === 'json') {
        // 验证 JSON 格式
        JSON.parse(webSocketTool.messageInput);
      }

      webSocketClient.send(messageToSend);
      addWebSocketMessage({
        id: Date.now().toString(),
        type: 'sent',
        content: messageToSend,
        timestamp: Date.now(),
      });
      updateWebSocketTool({ messageInput: '', error: '' });
    } catch (error) {
      updateWebSocketTool({ error: (error as Error).message });
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={webSocketTool.url}
            onChange={(e) => updateWebSocketTool({ url: e.target.value })}
            className="flex-1 p-2 border rounded"
            placeholder="请输入 WebSocket URL (ws:// 或 wss://)"
          />
          {webSocketTool.status === 'disconnected' && (
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              连接
            </button>
          )}
          {(webSocketTool.status === 'connecting' || webSocketTool.status === 'connected') && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              断开
            </button>
          )}
        </div>
        <div className="mt-2 text-sm">
          状态: 
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            webSocketTool.status === 'connected' ? 'bg-green-100 text-green-800' :
            webSocketTool.status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {webSocketTool.status === 'connected' ? '已连接' :
             webSocketTool.status === 'connecting' ? '连接中' :
             '已断开'}
          </span>
        </div>
      </div>

      {webSocketTool.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {webSocketTool.error}
        </div>
      )}

      <div className="mb-4">
        <div className="border rounded p-4 h-64 overflow-y-auto">
          {webSocketTool.messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 p-2 rounded ${
                message.type === 'sent' ? 'bg-blue-50 border-l-4 border-blue-500' :
                message.type === 'received' ? 'bg-green-50 border-l-4 border-green-500' :
                'bg-gray-50 border-l-4 border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                <span>
                  {message.type === 'sent' ? '发送' :
                   message.type === 'received' ? '接收' :
                   '系统'}
                </span>
                <span>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="text-sm whitespace-pre-wrap">{message.content}</pre>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={webSocketTool.messageType}
          onChange={(e) => updateWebSocketTool({ messageType: e.target.value as 'text' | 'json' })}
          className="p-2 border rounded"
        >
          <option value="text">纯文本</option>
          <option value="json">JSON</option>
        </select>
        <input
          type="text"
          value={webSocketTool.messageInput}
          onChange={(e) => updateWebSocketTool({ messageInput: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-2 border rounded"
          placeholder={webSocketTool.messageType === 'json' ? '{"key": "value"}' : '请输入消息'}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={webSocketTool.status !== 'connected'}
        >
          发送
        </button>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={clearWebSocketMessages}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          清空消息
        </button>
      </div>
    </div>
  );
};

export default WebSocketTool;
