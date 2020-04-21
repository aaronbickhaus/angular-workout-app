import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private readonly snackBar: MatSnackBar) {}

  showSnackbar(message, action, duration) {
    this.snackBar.open(message, action, { duration: duration });
  }
}
