import React, { useEffect, useState } from 'react'
import Layout from './components/Layout'
import ToolContainer from './components/ToolContainer'
import { useAppStore, ToolType } from './store'
import { Base64Tool, UrlTool, JsonTool, useEncoderStore } from './modules/encoder'
import { TimestampTool, RegexTool, useDataStore } from './modules/data'
import { HttpTool, WebSocketTool } from './modules/network'
import HistoryTool from './modules/history'
import { useNetworkStore } from './store/networkStore'

interface ToolInfo {
  id: ToolType
  name: string
  description: string
}

const toolInfo: Record<ToolType, ToolInfo> = {
  'base64': { id: 'base64', name: 'Base64 编码解码', description: 'Base64 编码和解码工具' },
  'url-encode': { id: 'url-encode', name: 'URL 编码', description: 'URL 编码和解码工具' },
  'json-format': { id: 'json-format', name: 'JSON 格式化', description: 'JSON 格式化和压缩工具' },
  'http-request': { id: 'http-request', name: 'HTTP 请求', description: 'HTTP 请求测试工具' },
  'websocket-debug': { id: 'websocket-debug', name: 'WebSocket 调试', description: 'WebSocket 连接调试工具' },
  'timestamp': { id: 'timestamp', name: '时间戳转换', description: '时间戳和日期时间转换工具' },
  'regex': { id: 'regex', name: '正则表达式', description: '正则表达式测试工具' },
  'history': { id: 'history', name: '历史记录管理', description: '查看和管理工具使用历史记录' },
}

function App() {
  const [pingResult, setPingResult] = useState('')
  const { currentTool } = useAppStore()
  const { setCurrentTool: setEncoderTool } = useEncoderStore()
  const { setCurrentTool: setDataTool } = useDataStore()
  const { setCurrentTool: setNetworkTool } = useNetworkStore()
  const currentToolInfo = toolInfo[currentTool]

  useEffect(() => {
    window.electronAPI.ping().then(setPingResult)
  }, [])

  useEffect(() => {
    // 同步当前工具到编码解码工具状态
    if (currentTool === 'base64') {
      setEncoderTool('base64')
    } else if (currentTool === 'url-encode') {
      setEncoderTool('url')
    } else if (currentTool === 'json-format') {
      setEncoderTool('json')
    }
    // 同步当前工具到数据处理工具状态
    if (currentTool === 'timestamp') {
      setDataTool('timestamp')
    } else if (currentTool === 'regex') {
      setDataTool('regex')
    }
    // 同步当前工具到网络工具状态
    if (currentTool === 'http-request') {
      setNetworkTool('http')
    } else if (currentTool === 'websocket-debug') {
      setNetworkTool('websocket')
    }
  }, [currentTool, setEncoderTool, setDataTool, setNetworkTool])

  const renderToolComponent = () => {
    switch (currentTool) {
      case 'base64':
        return <Base64Tool />
      case 'url-encode':
        return <UrlTool />
      case 'json-format':
        return <JsonTool />
      case 'http-request':
        return <HttpTool />
      case 'websocket-debug':
        return <WebSocketTool />
      case 'timestamp':
        return <TimestampTool />
      case 'regex':
        return <RegexTool />
      case 'history':
        return <HistoryTool />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">此工具功能正在开发中...</p>
            <p className="mt-2 text-sm">请关注后续更新</p>
          </div>
        )
    }
  }

  return (
    <Layout>
      <ToolContainer 
        title={currentToolInfo.name} 
        description={currentToolInfo.description}
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">欢迎使用 {currentToolInfo.name}</h3>
            <p className="text-blue-700">{currentToolInfo.description}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">系统状态</h3>
            <div className="space-y-2">
              <p>IPC 通信: <span className="font-medium text-green-600">{pingResult === 'pong' ? '正常' : '连接中...'}</span></p>
              <p>当前工具: <span className="font-medium">{currentToolInfo.name}</span></p>
            </div>
          </div>
          
          {renderToolComponent()}
        </div>
      </ToolContainer>
    </Layout>
  )
}

export default App

