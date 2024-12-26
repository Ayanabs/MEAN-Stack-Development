import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private socket!: WebSocket | null;

  constructor() {
    // Check if running in the browser
    if (typeof window !== 'undefined' && 'WebSocket' in window) {
      this.socket = new WebSocket('ws://localhost:5000');
      this.setupWebSocketHandlers();
    } else {
      console.warn('WebSocket is not supported in this environment.');
      this.socket = null;
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
