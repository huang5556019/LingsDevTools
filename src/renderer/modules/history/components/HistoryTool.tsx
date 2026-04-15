import React, { useEffect } from 'react'
import { useHistoryStore } from '../../../store'
import dayjs from 'dayjs'
import { useAppStore, ToolType } from '../../../store'
import { useNetworkStore } from '../../../store/networkStore'
import { useDataStore } from '../../../store/dataStore'
import { useEncoderStore } from '../../../store/encoderStore'

const HistoryTool: React.FC = () => {
  const {
    history,
    favorites,
    loading,
    error,
    selectedIds,
    currentTab,
    fetchHistory,
    fetchFavorites,
    deleteHistory,
    clearHistory,
    deleteFavorite,
    toggleSelection,
    clearSelection,
    selectAll,
    setCurrentTab,
  } = useHistoryStore()

  const { setCurrentTool } = useAppStore()
  const networkStore = useNetworkStore()
  const dataStore = useDataStore()
  const encoderStore = useEncoderStore()

  useEffect(() => {
    if (currentTab === 'history') {
      fetchHistory()
    } else {
      fetchFavorites()
    }
  }, [currentTab, fetchHistory, fetchFavorites])

  const getToolDisplayName = (toolType: string): string => {
    const names: Record<string, string> = {
      http: 'HTTP 请求',
      websocket: 'WebSocket',
      regex: '正则表达式',
      base64: 'Base64',
      url: 'URL 编码',
      json: 'JSON 格式化',
      timestamp: '时间戳转换',
    }
    return names[toolType] || toolType
  }

  const getToolTypeFromHistory = (toolType: string): ToolType | null => {
    const mapping: Record<string, ToolType> = {
      http: 'http-request',
      websocket: 'websocket-debug',
      regex: 'regex',
      base64: 'base64',
      url: 'url-encode',
      json: 'json-format',
      timestamp: 'timestamp',
    }
    return mapping[toolType] || null
  }

  const loadHistoryItem = (item: any) => {
    const toolType = getToolTypeFromHistory(item.tool_type)
    if (!toolType) return

    setCurrentTool(toolType)

    try {
      const inputData = JSON.parse(item.input)

      switch (item.tool_type) {
        case 'http':
          networkStore.updateHttpTool({
            url: inputData.url || '',
            method: inputData.method || 'GET',
            headers: inputData.headers || [],
            body: inputData.body || '',
            bodyType: inputData.bodyType || 'json',
          })
          break
        case 'regex':
          dataStore.setToolState('regex', {
            pattern: inputData.pattern || '',
            flags: inputData.flags || 'g',
            testText: inputData.testString || '',
          })
          break
        case 'base64':
          encoderStore.setToolState('base64', {
            input: inputData.input || '',
            operation: inputData.mode || 'encode',
          })
          break
        case 'url':
          encoderStore.setToolState('url', {
            input: inputData.input || '',
            operation: inputData.mode || 'encode',
          })
          break
        case 'json':
          encoderStore.setToolState('json', {
            input: inputData.input || '',
            operation: inputData.action || 'format',
          })
          break
        case 'timestamp':
          dataStore.setToolState('timestamp', {
            input: inputData.input || '',
            operation: inputData.mode || 'timestampToDate',
          })
          break
      }
    } catch (e) {
      console.error('解析历史记录数据失败:', e)
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentTab === 'history'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            历史记录
          </button>
          <button
            onClick={() => setCurrentTab('favorites')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentTab === 'favorites'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            收藏
          </button>
        </div>
      </div>

      {currentTab === 'history' && (
        <>
          <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                全选
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                取消选择
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => deleteHistory(selectedIds)}
                  className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
                >
                  删除选中 ({selectedIds.length})
                </button>
              )}
              <button
                onClick={clearHistory}
                className="px-3 py-1 text-sm bg-gray-500 text-white hover:bg-gray-600 rounded"
              >
                清空全部
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">加载中...</div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-32">
                <div className="text-red-500">{error}</div>
              </div>
            )}

            {!loading && !error && history.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">暂无历史记录</div>
              </div>
            )}

            {!loading && !error && history.length > 0 && (
              <ul className="divide-y divide-gray-200">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedIds.includes(item.id!) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {getToolDisplayName(item.tool_type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 truncate">
                          输入: {truncateText(item.input, 80)}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          输出: {truncateText(item.output, 80)}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id!)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleSelection(item.id!)
                        }}
                        className="ml-4 mt-1"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {currentTab === 'favorites' && (
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">加载中...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-32">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && favorites.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">暂无收藏</div>
            </div>
          )}

          {!loading && !error && favorites.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {favorites.map((item) => (
                <li
                  key={item.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => loadHistoryItem({ ...item, input: item.data, output: '' })}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {getToolDisplayName(item.tool_type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFavorite(item.id!)
                      }}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default HistoryTool
