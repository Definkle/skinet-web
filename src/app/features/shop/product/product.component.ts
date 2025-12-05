import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { IProduct } from '../../../core/api/products/product.interface';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatCard, MatCardContent, MatCardActions, MatButton, MatIcon, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class Product {
  product = input<IProduct>();
}
