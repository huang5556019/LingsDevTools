import { ipcMain } from 'electron'
import { initDatabase, saveHistory, getAllHistory, deleteHistory, clearHistory, saveFavorite, getAllFavorites, deleteFavorite } from '../database/index.js'

export function registerIpcHandlers() {
  ipcMain.handle('ping', () => {
    return 'pong'
  })

  ipcMain.handle('db:init', async () => {
    try {
      return initDatabase()
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw new Error('数据库初始化失败')
    }
  })

  ipcMain.handle('history:save', async (_event, record) => {
    console.log('handlers: history:save 被调用', record)
    return saveHistory(record)
  })

  ipcMain.handle('history:getAll', async (_event, params) => {
    console.log('handlers: history:getAll 被调用', params)
    return getAllHistory(params?.limit, params?.offset)
  })

  ipcMain.handle('history:delete', async (_event, { ids }) => {
    return deleteHistory(ids)
  })

  ipcMain.handle('history:clear', async () => {
    return clearHistory()
  })

  ipcMain.handle('favorites:save', async (_event, record) => {
    return saveFavorite(record)
  })

  ipcMain.handle('favorites:getAll', async (_event, params) => {
    return getAllFavorites(params?.tool_type)
  })

  ipcMain.handle('favorites:delete', async (_event, { id }) => {
    return deleteFavorite(id)
  })
}
