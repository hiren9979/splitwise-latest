import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense/expense.service';

@Component({
  selector: 'app-expense-history',
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css'],
})
export class ExpenseHistoryComponent implements OnInit {
  expenses: any[] = [];
  userId: number | null = null;
  expenseHistory: any = [];
  otherUserId: string | null = null;
  loginUserId: string | null = null;
  balance: number = 0;
  Math = Math; // Make Math available in template

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.otherUserId = this.route.snapshot.paramMap.get('id') || '';
      console.log(this.otherUserId);

      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      this.loginUserId = user ? user.id : null;
      console.log("Login User ID:", this.loginUserId);
      if (this.otherUserId) {
        this.fetchExpenseHistory();
      }
    });
  }

  fetchExpenseHistory(): void {
    this.expenseService.expenseHistory(this.otherUserId).subscribe(
      (response: any) => {
        console.log(response);
        
        this.expenses = response.transactions;
        this.balance = response.balance;
        console.log('Expenses:', this.expenses);
        console.log('Expense History:', this.expenseHistory);
      },
      (error: any) => {
        console.error('Error fetching expense history:', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
