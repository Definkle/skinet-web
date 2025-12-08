import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CardComponent } from '@components/card/card.component';

@Component({
  selector: 'app-auth-card',
  imports: [CardComponent],
  template: '<div class="mx-auto max-w-md pt-50"><app-card class="flex flex-col gap-1"><ng-content></ng-content></app-card></div>',
  styleUrl: './auth-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCardComponent {}
