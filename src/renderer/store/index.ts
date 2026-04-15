import { create } from 'zustand'
import { useHistoryStore } from './historyStore'

export type ToolType = 'base64' | 'url-encode' | 'json-format' | 'http-request' | 'websocket-debug' | 'timestamp' | 'regex' | 'history'

interface AppState {
  currentTool: ToolType
  setCurrentTool: (tool: ToolType) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentTool: 'base64',
  setCurrentTool: (tool) => set({ currentTool: tool }),
}))

export { useHistoryStore }
