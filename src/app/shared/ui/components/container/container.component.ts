import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-container',
  imports: [],
  template: '<div class="mx-auto max-w-screen-2xl"><ng-content></ng-content></div>',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {}
