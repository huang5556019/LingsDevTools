import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { mainWindow } from '../index.js'

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
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_history_created_at ON history (created_at DESC)
  `)
  
  console.log('数据表创建成功')
}

const HISTORY_LIMIT = 1000

export function saveHistory(record: HistoryRecord): { success: boolean; id?: number; error?: string } {
  try {
    const db = getDatabase()
    
    const countResult = db.prepare('SELECT COUNT(*) as count FROM history').get() as { count: number }
    if (countResult.count >= HISTORY_LIMIT) {
      db.prepare('DELETE FROM history WHERE id IN (SELECT id FROM history ORDER BY created_at ASC LIMIT 1)').run()
    }
    
    const stmt = db.prepare('INSERT INTO history (tool_type, input, output) VALUES (?, ?, ?)')
    const result = stmt.run(record.tool_type, record.input, record.output)
    
    return { success: true, id: result.lastInsertRowid as number }
  } catch (error) {
    console.error('保存历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function getAllHistory(limit?: number, offset?: number): { success: boolean; data: HistoryRecord[]; error?: string } {
  try {
    const db = getDatabase()
    let query = 'SELECT * FROM history ORDER BY created_at DESC'
    const params: any[] = []
    
    if (limit !== undefined) {
      query += ' LIMIT ?'
      params.push(limit)
      
      if (offset !== undefined) {
        query += ' OFFSET ?'
        params.push(offset)
      }
    }
    
    const stmt = db.prepare(query)
    const data = stmt.all(...params) as HistoryRecord[]
    
    return { success: true, data }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return { success: false, data: [], error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function deleteHistory(ids: number[]): { success: boolean; error?: string } {
  try {
    const db = getDatabase()
    const placeholders = ids.map(() => '?').join(',')
    const stmt = db.prepare(`DELETE FROM history WHERE id IN (${placeholders})`)
    stmt.run(...ids)
    
    return { success: true }
  } catch (error) {
    console.error('删除历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function clearHistory(): { success: boolean; error?: string } {
  try {
    const db = getDatabase()
    db.prepare('DELETE FROM history').run()
    
    return { success: true }
  } catch (error) {
    console.error('清空历史记录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function saveFavorite(record: FavoriteRecord): { success: boolean; id?: number; error?: string } {
  try {
    const db = getDatabase()
    const stmt = db.prepare('INSERT INTO favorites (tool_type, name, data) VALUES (?, ?, ?)')
    const result = stmt.run(record.tool_type, record.name, record.data)
    
    return { success: true, id: result.lastInsertRowid as number }
  } catch (error) {
    console.error('保存收藏失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function getAllFavorites(toolType?: string): { success: boolean; data: FavoriteRecord[]; error?: string } {
  try {
    const db = getDatabase()
    let query = 'SELECT * FROM favorites ORDER BY created_at DESC'
    const params: any[] = []
    
    if (toolType) {
      query += ' WHERE tool_type = ?'
      params.push(toolType)
    }
    
    const stmt = db.prepare(query)
    const data = stmt.all(...params) as FavoriteRecord[]
    
    return { success: true, data }
  } catch (error) {
    console.error('获取收藏失败:', error)
    return { success: false, data: [], error: error instanceof Error ? error.message : '未知错误' }
  }
}

export function deleteFavorite(id: number): { success: boolean; error?: string } {
  try {
    const db = getDatabase()
    const stmt = db.prepare('DELETE FROM favorites WHERE id = ?')
    stmt.run(id)
    
    return { success: true }
  } catch (error) {
    console.error('删除收藏失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

export { db }
