import { FieldTree } from '@angular/forms/signals';

type TFieldTypes = 'text' | 'email' | 'password' | 'number';

export interface IFieldModelUI {
  label: string;
}

export interface IFieldModel<T = string> extends IFieldModelUI {
  field: FieldTree<T, string>;
  type: TFieldTypes;
}
