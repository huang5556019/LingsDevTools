import { create } from 'zustand';

interface ToolState {
  input: string;
  output: string;
  operation: string;
  error: string;
}

interface EncoderState {
  currentTool: 'base64' | 'url' | 'json';
  toolStates: Record<string, ToolState>;
  setCurrentTool: (tool: 'base64' | 'url' | 'json') => void;
  setToolState: (tool: string, state: Partial<ToolState>) => void;
  getToolState: (tool: string) => ToolState;
  resetToolState: (tool: string) => void;
}

const initialToolState: ToolState = {
  input: '',
  output: '',
  operation: 'encode',
  error: '',
};

export const useEncoderStore = create<EncoderState>((set, get) => ({
  currentTool: 'base64',
  toolStates: {
    base64: { ...initialToolState, operation: 'encode' },
    url: { ...initialToolState, operation: 'encode' },
    json: { ...initialToolState, operation: 'format' },
  },
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setToolState: (tool, state) =>
    set((prev) => ({
      toolStates: {
        ...prev.toolStates,
        [tool]: {
          ...prev.toolStates[tool],
          ...state,
        },
      },
    })),
  getToolState: (tool) => get().toolStates[tool] || initialToolState,
  resetToolState: (tool) =>
    set((prev) => ({
      toolStates: {
        ...prev.toolStates,
        [tool]: initialToolState,
      },
    })),
}));
