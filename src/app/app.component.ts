import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ContainerComponent } from '@components/container/container.component';

import { HeaderComponent } from '@layout/header/header.component';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = signal('Skinet Web');
  protected readonly CartStore = inject(CartStore);
}
