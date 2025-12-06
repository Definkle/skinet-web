import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalStore } from '../../core/state/global';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CartStore } from '../../core/state/cart';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadge, MatButton, MatIcon, RouterLink, RouterLinkActive, MatProgressBar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class Header {
  protected CartStore = inject(CartStore);
  protected GlobalStore = inject(GlobalStore);

  protected readonly navLinks = [
    { link: '/', label: 'Home' },
    { link: '/shop', label: 'Shop' },
    { link: '/contact', label: 'Contact' },
  ];
}
