import React from 'react'
import { useAppStore, ToolType } from '../store'

interface ToolItem {
  id: ToolType
  name: string
  category: string
}

const tools: ToolItem[] = [
  { id: 'base64', name: 'Base64', category: '编码解码' },
  { id: 'url-encode', name: 'URL 编码', category: '编码解码' },
  { id: 'json-format', name: 'JSON 格式化', category: '编码解码' },
  { id: 'http-request', name: 'HTTP 请求', category: '网络工具' },
  { id: 'websocket-debug', name: 'WebSocket 调试', category: '网络工具' },
  { id: 'timestamp', name: '时间戳转换', category: '数据处理' },
  { id: 'regex', name: '正则表达式', category: '数据处理' },
  { id: 'history', name: '历史记录管理', category: '历史记录' },
]

const categories = ['编码解码', '网络工具', '数据处理', '历史记录']

function Sidebar() {
  const { currentTool, setCurrentTool } = useAppStore()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">DevTools</h1>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        {categories.map((category) => {
          const categoryTools = tools.filter((tool) => tool.category === category)
          return (
            <div key={category} className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {category}
              </h2>
              <ul className="space-y-1">
                {categoryTools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => setCurrentTool(tool.id)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        currentTool === tool.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

