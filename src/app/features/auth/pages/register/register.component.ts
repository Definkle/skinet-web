import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';

import { FormFieldComponent } from '@components/form-field/form-field.component';
import { IRegisterParams } from '@features/auth/services/account-api/account-api.params';
import { IFieldModel } from '@models/form-field.models';
import { passwordValidator } from '@shared/validators/password.validator';
import { AuthStore } from '@state/auth/auth.store';

import { AuthCardComponent } from '../../components/auth-card/auth-card.component';

@Component({
  selector: 'app-register',
  imports: [MatButton, FormsModule, AuthCardComponent, FormFieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  protected readonly AuthStore = inject(AuthStore);

  private readonly _form = signal<IRegisterParams>({ firstName: '', lastName: '', email: '', password: '' });

  protected readonly form = form(this._form, (form) => {
    required(form.firstName, { message: 'First name is required!' });
    required(form.lastName, { message: 'Last name is required!' });
    required(form.email, { message: 'Email is required!' });
    required(form.password, { message: 'Password is required!' });
    email(form.email, { message: 'Invalid email!' });
    passwordValidator(form.password);
  });
  protected readonly formRefs: IFieldModel[] = [
    {
      label: 'First Name',
      field: this.form.firstName,
      type: 'text',
    },
    {
      label: 'Last Name',
      field: this.form.lastName,
      type: 'text',
    },
    {
      label: 'Email',
      field: this.form.email,
      type: 'email',
    },
    {
      label: 'Password',
      field: this.form.password,
      type: 'password',
    },
  ];

  onClickRegister() {
    this.AuthStore.register(this.form().value());
  }
}
