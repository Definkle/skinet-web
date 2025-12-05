import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationError, Router, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header.component';
import { GlobalStore } from './core/state/global/global.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Skinet Web');
  protected readonly GlobalStore = inject(GlobalStore);
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      map((event) => {
        if (event instanceof NavigationError) {
          this.lastFailedUrl.set(event.url);

          if (event.error) {
            console.error('Navigation error', event.error);
          }

          return 'Navigation failed. Please try again.';
        }
        return '';
      }),
    ),
    { initialValue: '' },
  );
  errorMessage = this.navigationErrors;
  retryNavigation() {
    if (this.lastFailedUrl()) {
      void this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
