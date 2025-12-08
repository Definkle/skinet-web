import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _SnackBar = inject(MatSnackBar);

  error(message: string) {
    this._SnackBar.open(message, 'Close', { duration: 5000, panelClass: ['snackbar-error'] });
  }

  success(message: string) {
    this._SnackBar.open(message, 'Ok', { duration: 5000, panelClass: ['snackbar-success'] });
  }
}
