import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';
import { GlobalStore } from '@state/global';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadge, MatButton, MatIcon, RouterLink, RouterLinkActive, MatProgressBar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected AuthStore = inject(AuthStore);
  protected CartStore = inject(CartStore);
  protected GlobalStore = inject(GlobalStore);

  protected readonly navLinks = [
    { link: '/', label: 'Home' },
    { link: '/shop', label: 'Shop' },
    { link: '/contact', label: 'Contact' },
  ];
}
