import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadge, MatButton, MatIcon, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class Header {
  protected readonly navLinks = [
    { link: '/', label: 'Home' },
    { link: '/shop', label: 'Shop' },
    { link: '/contact', label: 'Contact' },
  ];
}
