import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response:any) => {
          if(response?.statusCode === 200)
          console.log('Login Successfull!', response.authData);
          localStorage.setItem('authToken', response.authData.authToken.toString());
          const user = {
            id: response.authData.id,
            email: response.authData.email,
            name: response.authData.name,
          }
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error logging in:', error);
        }
      );
    }
  }
}
