import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  private getHeaders() {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }

  getCategories() {
    return this.http.get(`${environment.apiUrl}/category`, {
      headers: this.getHeaders()
    });
  }

  createCategory(categoryData: any) {

    return this.http.post(`${environment.apiUrl}/category`, categoryData, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: number, categoryData: any) {
    return this.http.put(`${environment.apiUrl}/category`, categoryData, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: number) {
    const headers = this.getHeaders().set('id', id.toString());
    return this.http.delete(`${environment.apiUrl}/category/`, {
      headers: headers
    });
  }
} 