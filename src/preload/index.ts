import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export interface ElectronAPI {
  ping: () => Promise<string>
  initDatabase: () => Promise<boolean>
  onDatabaseError: (callback: (event: IpcRendererEvent, error: string) => void) => () => void
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
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

