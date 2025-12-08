import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';

import { ContainerComponent } from '@components/container/container.component';

interface IError {
  statusCode: number;
  message: string;
  details: string;
}

@Component({
  selector: 'app-server-error',
  imports: [MatCard, ContainerComponent],
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
