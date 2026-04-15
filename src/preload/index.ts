import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

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

interface HistorySaveResult {
  success: boolean
  id?: number
  error?: string
}

interface HistoryGetResult {
  success: boolean
  data: HistoryRecord[]
  error?: string
}

interface HistoryDeleteResult {
  success: boolean
  error?: string
}

interface FavoriteSaveResult {
  success: boolean
  id?: number
  error?: string
}

interface FavoriteGetResult {
  success: boolean
  data: FavoriteRecord[]
  error?: string
}

interface FavoriteDeleteResult {
  success: boolean
  error?: string
}

export interface ElectronAPI {
  ping: () => Promise<string>
  initDatabase: () => Promise<boolean>
  onDatabaseError: (callback: (event: IpcRendererEvent, error: string) => void) => () => void
  saveHistory: (record: HistoryRecord) => Promise<HistorySaveResult>
  getAllHistory: (params?: { limit?: number; offset?: number }) => Promise<HistoryGetResult>
  deleteHistory: (ids: number[]) => Promise<HistoryDeleteResult>
  clearHistory: () => Promise<HistoryDeleteResult>
  saveFavorite: (record: FavoriteRecord) => Promise<FavoriteSaveResult>
  getAllFavorites: (params?: { tool_type?: string }) => Promise<FavoriteGetResult>
  deleteFavorite: (id: number) => Promise<FavoriteDeleteResult>
}

const electronAPI: ElectronAPI = {
  ping: () => ipcRenderer.invoke('ping'),
  initDatabase: () => ipcRenderer.invoke('db:init'),
  onDatabaseError: (callback) => {
    const subscription = (_event: IpcRendererEvent, error: string) => callback(_event, error)
    ipcRenderer.on('db:error', subscription)
    return () => {
      ipcRenderer.off('db:error', subscription)
    }
  },
  saveHistory: (record) => ipcRenderer.invoke('history:save', record),
  getAllHistory: (params) => ipcRenderer.invoke('history:getAll', params),
  deleteHistory: (ids) => ipcRenderer.invoke('history:delete', { ids }),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  saveFavorite: (record) => ipcRenderer.invoke('favorites:save', record),
  getAllFavorites: (params) => ipcRenderer.invoke('favorites:getAll', params),
  deleteFavorite: (id) => ipcRenderer.invoke('favorites:delete', { id }),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

