import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { registerIpcHandlers } from './ipc/handlers.js'
import { initDatabase } from './database/index.js'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  try {
    initDatabase()
    
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    })

    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL('http://localhost:5173')
      mainWindow.webContents.openDevTools()
    } else {
      mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  } catch (error) {
    dialog.showErrorBox(
      '窗口创建失败',
      `无法创建应用窗口: ${error instanceof Error ? error.message : '未知错误'}\n\n请检查系统资源是否充足，然后重启应用。`
    )
    app.quit()
  }
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信示例
ipcMain.handle('ping', () => 'pong')

export { mainWindow }
