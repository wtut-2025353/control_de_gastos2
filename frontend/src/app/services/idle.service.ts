import { Injectable, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 30 * 1000;

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  private refreshTimer: ReturnType<typeof setInterval> | undefined;
  private isRunning = false;

  private readonly events = [
    'mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'
  ];

  private handleActivity = (): void => {
    this.resetIdleTimer();
  };

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.events.forEach((event) =>
      document.addEventListener(event, this.handleActivity, { passive: true })
    );
    this.scheduleRefresh();
    this.resetIdleTimer();
  }

  stop(): void {
    this.isRunning = false;
    this.events.forEach((event) =>
      document.removeEventListener(event, this.handleActivity)
    );
    this.clearTimers();
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.onIdle(), IDLE_TIMEOUT_MS);
  }

  private onIdle(): void {
    localStorage.setItem('session_expired', '1');
    this.authService.logout();
    this.stop();
    this.router.navigate(['/']);
  }

  private scheduleRefresh(): void {
    this.refreshTimer = setInterval(() => this.tryRefresh(), REFRESH_THRESHOLD_MS);
  }

  private async tryRefresh(): Promise<void> {
    const token = this.authService.getToken();
    if (!token) return;

    const remaining = this.authService.getExpiryMs(token);
    if (remaining <= REFRESH_THRESHOLD_MS) {
      this.authService.refreshToken().subscribe({
        next: (result) => this.authService.saveSession(result),
        error: () => {
          localStorage.setItem('session_expired', '1');
          this.authService.logout();
          this.stop();
          this.router.navigate(['/']);
        }
      });
    }
  }

  private clearTimers(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = undefined;
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
