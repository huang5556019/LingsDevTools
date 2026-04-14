export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatIntervalMs = 30000;
  
  public onOpen: () => void = () => {};
  public onClose: () => void = () => {};
  public onError: (error: Error) => void = () => {};
  public onMessage: (message: string) => void = () => {};

  connect(url: string): void {
    this.url = url;
    this.reconnectAttempts = 0;
    
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.onOpen();
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };
      
      this.ws.onclose = () => {
        this.onClose();
        this.stopHeartbeat();
        this.attemptReconnect();
      };
      
      this.ws.onerror = () => {
        this.onError(new Error('WebSocket 连接错误'));
      };
      
      this.ws.onmessage = (event) => {
        this.onMessage(event.data);
      };
    } catch (error) {
      this.onError(new Error('WebSocket 连接失败'));
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      throw new Error('WebSocket 未连接');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(this.url);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const webSocketClient = new WebSocketClient();
