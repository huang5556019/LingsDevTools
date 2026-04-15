import { ipcMain } from 'electron'

export function registerIpcHandlers() {
  ipcMain.handle('ping', () => {
    return 'pong'
  })

  ipcMain.handle('db:init', async () => {
    try {
      const { initDatabase } = await import('../database/index.js')
      return initDatabase()
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw new Error('数据库初始化失败')
    }
  })

  ipcMain.handle('history:save', async (_event, record) => {
    const { saveHistory } = await import('../database/index.js')
    return saveHistory(record)
  })

  ipcMain.handle('history:getAll', async (_event, params) => {
    const { getAllHistory } = await import('../database/index.js')
    return getAllHistory(params?.limit, params?.offset)
  })

  ipcMain.handle('history:delete', async (_event, { ids }) => {
    const { deleteHistory } = await import('../database/index.js')
    return deleteHistory(ids)
  })

  ipcMain.handle('history:clear', async () => {
    const { clearHistory } = await import('../database/index.js')
    return clearHistory()
  })

  ipcMain.handle('favorites:save', async (_event, record) => {
    const { saveFavorite } = await import('../database/index.js')
    return saveFavorite(record)
  })

  ipcMain.handle('favorites:getAll', async (_event, params) => {
    const { getAllFavorites } = await import('../database/index.js')
    return getAllFavorites(params?.tool_type)
  })

  ipcMain.handle('favorites:delete', async (_event, { id }) => {
    const { deleteFavorite } = await import('../database/index.js')
    return deleteFavorite(id)
  })
}
