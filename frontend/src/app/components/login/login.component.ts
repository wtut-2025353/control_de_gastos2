import {
  Component,
  ElementRef,
  type AfterViewInit,
  viewChild,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface GoogleAccounts {
  accounts?: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
      }) => void;
      renderButton: (container: HTMLElement, options: object) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';
  loggedIn = false;

  readonly hasGoogle = !!environment.googleClientId;

  private readonly googleButton = viewChild<ElementRef<HTMLDivElement>>('googleButton');
  private readonly authService = inject(AuthService);

  ngAfterViewInit(): void {
    if (environment.googleClientId) {
      this.loadGoogleScript()
        .then(() => this.renderGoogleButton())
        .catch(() => {
          this.errorMessage = 'No se pudo cargar el botón de Google';
        });
    }
  }

  handleLogin(): void {
    this.errorMessage = '';
    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña';
      return;
    }
    this.loading = true;
    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.token);
        this.loading = false;
        this.loggedIn = true;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'Error al iniciar sesión';
      }
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.loggedIn = false;
  }

  private readonly handleGoogleResponse = (response: { credential?: string }): void => {
    if (!response.credential) {
      this.errorMessage = 'No se recibió la credencial de Google';
      return;
    }
    this.loading = true;
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.token);
        this.loading = false;
        this.loggedIn = true;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'Error al iniciar sesión con Google';
      }
    });
  };

  private renderGoogleButton(): void {
    const container = this.googleButton()?.nativeElement;
    const google = window.google;
    if (!container || !google?.accounts) {
      return;
    }
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleResponse
    });
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'signin',
      shape: 'rectangular',
      width: 400
    });
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-google-gis="true"]'
      );
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () =>
          reject(new Error('Error al cargar el script de Google'))
        );
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset['googleGis'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error al cargar el script de Google'));
      document.head.appendChild(script);
    });
  }
}