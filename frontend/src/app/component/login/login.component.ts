import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          if (response) {
            // First store the auth data
            localStorage.setItem('authToken', response.authData.authToken.toString());
            const user = {
              id: response.authData.id,
              email: response.authData.email,
              name: response.authData.name,
            }
            localStorage.setItem('user', JSON.stringify(user));
            
            // Then show success message
            this.notificationService.showSuccess('Login successful!');
            console.log('Login Successful!', response.authData);
            
            // Use setTimeout to ensure all Angular change detection is complete
            setTimeout(() => {
              this.router.navigate(['/home'])
                .then(() => {
                  console.log('Navigation completed');
                })
                .catch(err => {
                  console.error('Navigation failed:', err);
                  // If navigation fails, try alternative route
                  this.router.navigate(['home'])
                    .catch(err2 => console.error('Alternative navigation failed:', err2));
                });
            }, 100);
          }
        },
        error: (error) => {
          this.notificationService.showError(error.error?.message || 'Login failed. Please try again.');
          console.error('Error logging in:', error);
        }
      });
    }
  }
}
