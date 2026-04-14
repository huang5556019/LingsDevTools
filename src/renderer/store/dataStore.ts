import { create } from 'zustand';

interface DataToolState {
  currentTool: 'timestamp' | 'regex';
  toolStates: Record<string, any>;
  setCurrentTool: (tool: 'timestamp' | 'regex') => void;
  setToolState: (tool: string, state: any) => void;
  getToolState: (tool: string) => any;
}

export const useDataStore = create<DataToolState>((set, get) => ({
  currentTool: 'timestamp',
  toolStates: {
    timestamp: {
      input: '',
      output: '',
      operation: 'timestampToDate',
      format: 'YYYY-MM-DD HH:mm:ss'
    },
    regex: {
      pattern: '',
      testText: '',
      replacement: '',
      flags: 'g',
      matches: [],
      result: ''
    }
  },
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setToolState: (tool, state) => set((prev) => ({
    toolStates: {
      ...prev.toolStates,
      [tool]: {
        ...prev.toolStates[tool],
        ...state
      }
    }
  })),
  getToolState: (tool) => get().toolStates[tool]
}));
