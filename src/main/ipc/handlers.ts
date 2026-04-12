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
}
