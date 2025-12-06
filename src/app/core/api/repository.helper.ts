import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export class RepositoryHelper {
  protected readonly _http = inject(HttpClient);
  protected readonly _baseUrl = environment.apiUrl;
}
