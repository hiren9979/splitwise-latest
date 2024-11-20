import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  signup(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any) {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      email: userData.email,
      password: userData.password,
    });

    return this.http.get(`${this.apiUrl}/login`, { headers: header });
  }

  getUsers() {
    const authToken = localStorage.getItem('authToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    })
    return this.http.get(`${this.apiUrl}/users`, { headers: header });
  }
}
