import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '@env/environment.development';

export class RepositoryHelperService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;
}
