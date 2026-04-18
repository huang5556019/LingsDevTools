import Store from 'electron-store'
import { app } from 'electron'
import { mainWindow } from '../index.js'

interface HistoryRecord {
  id: number
  tool_type: string
  input: string
  output: string
  created_at: string
}

interface FavoriteRecord {
  id: number
  tool_type: string
  name: string
  data: string
  created_at: string
}

interface StoreSchema {
  history: HistoryRecord[]
  favorites: FavoriteRecord[]
  historyCounter: number
  favoritesCounter: number
}

let store: Store<StoreSchema> | null = null

export function getStore(): Store<StoreSchema> {
  if (!store) {
    throw new Error('数据库未初始化')
  }
  return store
}

export function initDatabase(): { success: boolean; error?: string } {
  try {
    if (store) {
      console.log('数据库已初始化')
      return { success: true }
    }

    store = new Store<StoreSchema>({
      name: 'devtools-data',
      defaults: {
        history: [],
        favorites: [],
        historyCounter: 0,
        favoritesCounter: 0,
      },
    })

    console.log('数据库初始化成功')
    console.log('数据库路径:', store.path)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    const errorStack = error instanceof Error ? error.stack : ''
    console.error('数据库初始化失败:', errorMessage, errorStack)

    if (mainWindow) {
      mainWindow.webContents.send('db:error',
        `数据库初始化失败: ${errorMessage}\n${errorStack}`
      )
    }

    return { success: false, error: errorMessage }
  }
}

const HISTORY_LIMIT = 1000

export function saveHistory(record: Omit<HistoryRecord, 'id' | 'created_at'>): { success: boolean; id?: number; error?: string } {
  try {
    console.log('saveHistory 被调用:', record)
    const store = getStore()
    const history = store.get('history', [])
    const counter = store.get('historyCounter', 0)
    console.log('当前历史记录数量:', history.length)

    if (history.length >= HISTORY_LIMIT) {
      history.shift()
    }

    const newRecord: HistoryRecord = {
      id: counter + 1,
      tool_type: record.tool_type,
      input: record.input,
      output: record.output,
      created_at: new Date().toISOString(),
    }

    history.push(newRecord)
    store.set('history', history)
    store.set('historyCounter', counter + 1)
    console.log('保存后的历史记录数量:', history.length)

    return { success: true, id: newRecord.id }
  } catch (error) {
    console.error('保存历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function getAllHistory(limit?: number, offset?: number): { success: boolean; data: HistoryRecord[]; error?: string } {
  try {
    console.log('getAllHistory 被调用, limit:', limit, 'offset:', offset)
    const store = getStore()
    let history = store.get('history', [])
    console.log('从 store 获取的历史记录数量:', history.length)

    history = history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    if (offset !== undefined && limit !== undefined) {
      history = history.slice(offset, offset + limit)
    } else if (limit !== undefined) {
      history = history.slice(0, limit)
    }
    console.log('返回的历史记录数量:', history.length)

    return { success: true, data: history }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return { success: false, data: [], error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function deleteHistory(ids: number[]): { success: boolean; error?: string } {
  try {
    const store = getStore()
    const history = store.get('history', [])
    const filteredHistory = history.filter(item => !ids.includes(item.id))
    store.set('history', filteredHistory)

    return { success: true }
  } catch (error) {
    console.error('删除历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function clearHistory(): { success: boolean; error?: string } {
  try {
    const store = getStore()
    store.set('history', [])

    return { success: true }
  } catch (error) {
    console.error('清空历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function saveFavorite(record: Omit<FavoriteRecord, 'id' | 'created_at'>): { success: boolean; id?: number; error?: string } {
  try {
    const store = getStore()
    const favorites = store.get('favorites', [])
    const counter = store.get('favoritesCounter', 0)

    const newRecord: FavoriteRecord = {
      id: counter + 1,
      tool_type: record.tool_type,
      name: record.name,
      data: record.data,
      created_at: new Date().toISOString(),
    }

    favorites.push(newRecord)
    store.set('favorites', favorites)
    store.set('favoritesCounter', counter + 1)

    return { success: true, id: newRecord.id }
  } catch (error) {
    console.error('保存收藏失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function getAllFavorites(toolType?: string): { success: boolean; data: FavoriteRecord[]; error?: string } {
  try {
    const store = getStore()
    let favorites = store.get('favorites', [])

    favorites = favorites.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    if (toolType) {
      favorites = favorites.filter(item => item.tool_type === toolType)
    }

    return { success: true, data: favorites }
  } catch (error) {
    console.error('获取收藏失败:', error)
    return { success: false, data: [], error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function deleteFavorite(id: number): { success: boolean; error?: string } {
  try {
    const store = getStore()
    const favorites = store.get('favorites', [])
    const filteredFavorites = favorites.filter(item => item.id !== id)
    store.set('favorites', filteredFavorites)

    return { success: true }
  } catch (error) {
    console.error('删除收藏失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}
