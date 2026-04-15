import { create } from 'zustand'

interface HistoryRecord {
  id?: number
  tool_type: string
  input: string
  output: string
  created_at?: string
}

interface FavoriteRecord {
  id?: number
  tool_type: string
  name: string
  data: string
  created_at?: string
}

interface HistoryState {
  history: HistoryRecord[]
  favorites: FavoriteRecord[]
  loading: boolean
  error: string | null
  selectedIds: number[]
  currentTab: 'history' | 'favorites'
  fetchHistory: () => Promise<void>
  fetchFavorites: (toolType?: string) => Promise<void>
  saveHistory: (record: HistoryRecord) => Promise<void>
  saveFavorite: (record: FavoriteRecord) => Promise<void>
  deleteHistory: (ids: number[]) => Promise<void>
  deleteFavorite: (id: number) => Promise<void>
  clearHistory: () => Promise<void>
  toggleSelection: (id: number) => void
  clearSelection: () => void
  selectAll: () => void
  setCurrentTab: (tab: 'history' | 'favorites') => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  favorites: [],
  loading: false,
  error: null,
  selectedIds: [],
  currentTab: 'history',

  fetchHistory: async () => {
    set({ loading: true, error: null })
    try {
      const result = await window.electronAPI.getAllHistory()
      if (result.success) {
        set({ history: result.data })
      } else {
        set({ error: result.error || '获取历史记录失败' })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取历史记录失败' })
    } finally {
      set({ loading: false })
    }
  },

  fetchFavorites: async (toolType?: string) => {
    set({ loading: true, error: null })
    try {
      const result = await window.electronAPI.getAllFavorites(toolType ? { tool_type: toolType } : undefined)
      if (result.success) {
        set({ favorites: result.data })
      } else {
        set({ error: result.error || '获取收藏失败' })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取收藏失败' })
    } finally {
      set({ loading: false })
    }
  },

  saveHistory: async (record: HistoryRecord) => {
    try {
      const result = await window.electronAPI.saveHistory(record)
      if (result.success) {
        await get().fetchHistory()
      }
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  },

  saveFavorite: async (record: FavoriteRecord) => {
    try {
      const result = await window.electronAPI.saveFavorite(record)
      if (result.success) {
        await get().fetchFavorites()
      }
    } catch (error) {
      console.error('保存收藏失败:', error)
    }
  },

  deleteHistory: async (ids: number[]) => {
    try {
      const result = await window.electronAPI.deleteHistory(ids)
      if (result.success) {
        set({ selectedIds: [] })
        await get().fetchHistory()
      }
    } catch (error) {
      console.error('删除历史记录失败:', error)
    }
  },

  deleteFavorite: async (id: number) => {
    try {
      const result = await window.electronAPI.deleteFavorite(id)
      if (result.success) {
        await get().fetchFavorites()
      }
    } catch (error) {
      console.error('删除收藏失败:', error)
    }
  },

  clearHistory: async () => {
    try {
      const result = await window.electronAPI.clearHistory()
      if (result.success) {
        set({ selectedIds: [] })
        await get().fetchHistory()
      }
    } catch (error) {
      console.error('清空历史记录失败:', error)
    }
  },

  toggleSelection: (id: number) => {
    set((state) => {
      const selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id]
      return { selectedIds }
    })
  },

  clearSelection: () => {
    set({ selectedIds: [] })
  },

  selectAll: () => {
    set((state) => {
      const selectedIds = state.history.map((record) => record.id!).filter((id): id is number => id !== undefined)
      return { selectedIds }
    })
  },

  setCurrentTab: (tab: 'history' | 'favorites') => {
    set({ currentTab: tab })
  },
}))
