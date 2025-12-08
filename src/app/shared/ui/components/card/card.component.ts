import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div class="space-y-4 rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
