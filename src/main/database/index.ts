import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { mainWindow } from '../index.js'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('数据库未初始化')
  }
  return db
}

export function initDatabase(): boolean {
  try {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'devtools.db')
    
    console.log('数据库路径:', dbPath)
    
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    
    createTables()
    
    console.log('数据库初始化成功')
    return true
  } catch (error) {
    console.error('数据库初始化失败:', error)
    
    if (mainWindow) {
      mainWindow.webContents.send('db:error', 
        `数据库初始化失败: ${error instanceof Error ? error.message : '未知错误'}`
      )
    }
    
    return false
  }
}

function createTables() {
  const db = getDatabase()
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_type TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_type TEXT NOT NULL,
      name TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  console.log('数据表创建成功')
}

export { db }
