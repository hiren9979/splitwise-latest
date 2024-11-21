import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseComponent } from '../add-expense/add-expense.component';

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

  // Predefined colors for category icons
  private colors = [
    '#4CAF50', '#2196F3', '#9C27B0', '#F44336',
    '#FF9800', '#009688', '#3F51B5', '#E91E63'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.otherUserId = this.route.snapshot.paramMap.get('id') || '';

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
        
        // Sort expenses by date (newest first)
        this.expenses.sort((a, b) => {
          return new Date(b.expense.date).getTime() - new Date(a.expense.date).getTime();
        });
      },
      (error: any) => {
        console.error('Error fetching expense history:', error);
      }
    );
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '600px',
      disableClose: true,
      data: { userId: this.otherUserId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchExpenseHistory(); // Refresh the list after adding expense
      }
    });
  }

  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
