import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/model/response.model';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) { }

  splitEqually(selectedUsers: string[], totalExpense: number, title: string, notes: string, date: number, splitType: string, category: string) {
    const apiUrl = `${environment.apiUrl}/expense/equally`;

    const authToken = localStorage.getItem('authToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    });

    const expenseData = {
      owedBy: selectedUsers,
      totalExpense: totalExpense,
      title: title,
      notes: notes,
      splitType: splitType,
      date: date,
      categoryId: category,
      paidBy: 1
    }
    return this.http.post(apiUrl, expenseData, { headers: header });
  }

  splitUnequally(totalExpense: number, notes: string, unEqualExpense: any[], splitType: string, category: string) {
    const authToken = localStorage.getItem('authToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    });

    const apiUrl = `${environment.apiUrl}/expense/unequally`;
    const expenseData = {
      totalExpense: totalExpense,
      notes: notes,
      splitType: 'unEqually',
      unEqualExpense: unEqualExpense,
      category: category,
      paidBy: 1
    }
    return this.http.post(apiUrl, expenseData, { headers: header});
  }

  expenseHistory(otherUserId: any) {

    const authToken = localStorage.getItem('authToken');
    const apiUrl = `${environment.apiUrl}/expense/history`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'otherUserId': otherUserId,
      'Authorization': `Bearer ${authToken}`,
    });

    return this.http.get(apiUrl, { headers: header });
  }


  getExpensesByCategory() {
    const authToken = localStorage.getItem('authToken');
    const apiUrl = `${environment.apiUrl}/chart/byCategory`;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
    });
    return this.http.get(apiUrl, { headers: header });
  }


  getExpenseByMonth() {
    const authToken = localStorage.getItem('authToken');
    const apiUrl = `${environment.apiUrl}/chart/byMonth`;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
    });
    return this.http.get(apiUrl, { headers: header });
  }

  getIndividualBalance() {
    const authToken = localStorage.getItem('authToken');
    const apiUrl = `${environment.apiUrl}/chart/individualBalance`;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
    });
    return this.http.get(apiUrl, { headers: header });
  }

  getBalanceOverview(dateFilter:any) {
    const authToken = localStorage.getItem('authToken');
    const apiUrl = `${environment.apiUrl}/chart/balanceOverview`;
    
    const header = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'year': dateFilter.year.toString(),
      'month': dateFilter.month.toString()
    });
    
    return this.http.get(apiUrl, { headers: header });
  }
}
