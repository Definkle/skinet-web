import { FieldTree } from '@angular/forms/signals';

export interface IFieldModel<T = string> {
  label: string;
  field: FieldTree<T, string>;
  type: 'text' | 'email' | 'password' | 'number';
}
