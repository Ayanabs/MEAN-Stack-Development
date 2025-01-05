import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private sessionService = inject(SessionService);
  private router = inject(Router);

  canActivate(): boolean {
    const sessionId = this.sessionService.getSession();
    if (sessionId) {
      return true;
    } else {
      this.router.navigate(['/userlogin']); // Redirect to login
      return false;
    }
  }
}
