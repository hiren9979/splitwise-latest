import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'basic-angular';
  userName: string = '';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    // Get username when component initializes
    this.getUserName();

    // Subscribe to router events to check current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide navbar for login and signup pages
      this.showNavbar = !['/login', '/signup'].includes(event.url);
    });
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
