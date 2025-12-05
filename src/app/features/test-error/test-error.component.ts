import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestError {
  private _httpClient = inject(HttpClient);
  baseUrl = 'https://localhost:5000/api/';
  validationErrors = signal<string[]>([]);

  get404Error() {
    this._httpClient.get(this.baseUrl + 'buggy/notFound').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get400Error() {
    this._httpClient.get(this.baseUrl + 'buggy/badRequest').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get401Error() {
    this._httpClient.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get500Error() {
    this._httpClient.get(this.baseUrl + 'buggy/internalError').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get400ValidationError() {
    this._httpClient.post(this.baseUrl + 'buggy/validationError', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => this.validationErrors.update(() => error),
    });
  }
}
