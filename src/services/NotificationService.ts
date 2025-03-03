import { WebSocketService } from './WebSocketService';

export class NotificationService {
  private ws: WebSocketService;
  private subscribers: ((notification: any) => void)[] = [];

  constructor() {
    this.ws = new WebSocketService(import.meta.env.VITE_WS_URL);
    this.ws.onMessage(this.handleNotification.bind(this));
  }

  subscribe(callback: (notification: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private handleNotification(notification: any) {
    this.subscribers.forEach(callback => callback(notification));
  }

  async sendNotification(userId: string, message: string, type: string) {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message,
        type,
      }),
    });
  }
} 