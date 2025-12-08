import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

import { IFieldModel } from '@models/form-field.models';

@Component({
  selector: 'app-form-field',
  imports: [MatError, MatFormField, MatInput, MatLabel, Field],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  control = input.required<IFieldModel>();
}
