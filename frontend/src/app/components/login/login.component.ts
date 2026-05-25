import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userId = '';
  password = '';
  role = '';
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (!this.userId || !this.password || !this.role) { 
      this.error = 'Please enter user ID and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.userId, this.password, this.role).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}
