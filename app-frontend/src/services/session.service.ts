import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  private sessionKey = 'app-session';

  // Save session data
  setSession(sessionData: { sessionId: string; userId: string; username: string }) {
    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  getSession() {
    const session = localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }


  // Clear session data
  clearSession(): void {
    // Clear data from localStorage
    localStorage.removeItem(this.sessionKey);
  }
}
