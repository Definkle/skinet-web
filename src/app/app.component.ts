import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header.component';
import { ProductsStore } from './features/products/state/products.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  providers: [ProductsStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly title = signal('Skinet Web');
  protected readonly store = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadByQuery({
      pageIndex: 1,
      pageSize: 10,
    });
  }
}
