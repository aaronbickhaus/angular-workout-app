import { Subject } from 'rxjs/Subject';
import { AuthData } from './auth-data.model';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService implements OnDestroy {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private readonly trainingService: TrainingService,
    private readonly router: Router,
    private readonly afAuth: AngularFireAuth,
    private readonly uiService: UIService
  ) {}

  ngOnDestroy(): void {}

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);

    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);

    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }
}
