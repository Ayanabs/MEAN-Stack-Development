import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  private sessionKey = 'app-session';

  // Check if the code is running in a browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Save session data
  setSession(sessionData: { sessionId: string; userId: string; username: string, selectedMovie: string, selectedTime: string, selectedSeats: { row: number; seat: number }[]  }) {
    if (this.isBrowser()) {
      console.log("Saving session data to localStorage:", sessionData);
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }
  }

  getSession() {
    if (this.isBrowser()) {
      const session = localStorage.getItem(this.sessionKey);
      return session ? JSON.parse(session) : null;
    }
    return null;  // Return null if not in browser environment
  }

  // Clear session data
  clearSession(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.sessionKey);
    }
  }
}
