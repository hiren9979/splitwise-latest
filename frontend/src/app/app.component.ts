import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'basic-angular';
  userName: string = '';

  constructor(private router: Router) {
    // Get username when component initializes
    this.getUserName();
  }

  getUserName() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userName = user.name;
    }
  }

  logout() {
    console.log('logged out');
    this.router.navigate(['/login']);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.userName = ''; // Clear username on logout
  }
}
