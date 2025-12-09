import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';

import { FormFieldComponent } from '@components/form-field/form-field.component';

import { type ILoginParams } from '@features/auth/services/login-api/login-api.params';

import { type IFieldModel } from '@models/form-field.models';

import { AuthStore } from '@state/auth/auth.store';

import { AuthCardComponent } from '../../components/auth-card/auth-card.component';

@Component({
  selector: 'app-login',
  imports: [MatButton, FormsModule, AuthCardComponent, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly AuthStore = inject(AuthStore);

  private readonly _form = signal<ILoginParams>({ email: '', password: '' });

  protected readonly form = form(this._form, (form) => {
    required(form.email, { message: 'Email is required!' });
    required(form.password, { message: 'Password is required!' });
    email(form.email, { message: 'Invalid email!' });
  });
  protected readonly formRefs: IFieldModel[] = [
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

  onClickLogin() {
    this.AuthStore.login(this.form().value());
  }
}
