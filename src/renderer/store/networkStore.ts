import { create } from 'zustand';

interface HttpToolState {
  url: string;
  method: string;
  headers: Array<{ key: string; value: string }>;
  body: string;
  bodyType: 'json' | 'form' | 'text';
  response: {
    status: number | null;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    time: number | null;
  };
  loading: boolean;
  error: string;
}

interface WebSocketToolState {
  url: string;
  status: 'disconnected' | 'connecting' | 'connected';
  messages: Array<{
    id: string;
    type: 'sent' | 'received' | 'system';
    content: string;
    timestamp: number;
  }>;
  messageInput: string;
  messageType: 'text' | 'json';
  error: string;
}

interface NetworkState {
  currentTool: 'http' | 'websocket';
  httpTool: HttpToolState;
  webSocketTool: WebSocketToolState;
  setCurrentTool: (tool: 'http' | 'websocket') => void;
  updateHttpTool: (state: Partial<HttpToolState>) => void;
  updateWebSocketTool: (state: Partial<WebSocketToolState>) => void;
  addHttpHeader: () => void;
  removeHttpHeader: (index: number) => void;
  addWebSocketMessage: (message: WebSocketToolState['messages'][0]) => void;
  clearWebSocketMessages: () => void;
}

const initialHttpToolState: HttpToolState = {
  url: '',
  method: 'GET',
  headers: [],
  body: '',
  bodyType: 'json',
  response: {
    status: null,
    statusText: '',
    headers: {},
    data: null,
    time: null,
  },
  loading: false,
  error: '',
};

const initialWebSocketToolState: WebSocketToolState = {
  url: '',
  status: 'disconnected',
  messages: [],
  messageInput: '',
  messageType: 'text',
  error: '',
};

export const useNetworkStore = create<NetworkState>((set) => ({
  currentTool: 'http',
  httpTool: initialHttpToolState,
  webSocketTool: initialWebSocketToolState,
  setCurrentTool: (tool) => set({ currentTool: tool }),
  updateHttpTool: (state) =>
    set((prev) => ({
      httpTool: {
        ...prev.httpTool,
        ...state,
      },
    })),
  updateWebSocketTool: (state) =>
    set((prev) => ({
      webSocketTool: {
        ...prev.webSocketTool,
        ...state,
      },
    })),
  addHttpHeader: () =>
    set((prev) => ({
      httpTool: {
        ...prev.httpTool,
        headers: [...prev.httpTool.headers, { key: '', value: '' }],
      },
    })),
  removeHttpHeader: (index) =>
    set((prev) => ({
      httpTool: {
        ...prev.httpTool,
        headers: prev.httpTool.headers.filter((_, i) => i !== index),
      },
    })),
  addWebSocketMessage: (message) =>
    set((prev) => ({
      webSocketTool: {
        ...prev.webSocketTool,
        messages: [...prev.webSocketTool.messages, message],
      },
    })),
  clearWebSocketMessages: () =>
    set((prev) => ({
      webSocketTool: {
        ...prev.webSocketTool,
        messages: [],
      },
    })),
}));
