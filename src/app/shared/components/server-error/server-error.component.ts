import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard } from '@angular/material/card';

interface IError {
  statusCode: number;
  message: string;
  details: string;
}

@Component({
  selector: 'app-server-error',
  imports: [MatCard],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorComponent {
  private readonly _Router = inject(Router);
  error = signal<IError | null>(null);

  constructor() {
    const navigation = this._Router.currentNavigation();
    this.error.update(() => navigation?.extras?.state?.['error']);
  }
}
