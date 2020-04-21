import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'fitness-tracker';
  openSidenav = false;
  constructor(
    private readonly authService: AuthService,
    firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
