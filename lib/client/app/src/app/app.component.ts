import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'daily-tracker';
  public isAuthenticated = false;

  constructor(private authService: AuthService) {
    this.authService.validateAccess().then(
      () => this.isAuthenticated = true,
    );
  }

  public logout(): void {
    this.authService.logout();
  }
}
