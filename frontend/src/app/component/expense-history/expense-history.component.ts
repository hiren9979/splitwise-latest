import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-expense-history',
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css'],
})
export class ExpenseHistoryComponent implements OnInit {
  expenses: Expense[] = [];
  userId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  // Dummy expense data
  private allExpenses: { [key: number]: Expense[] } = {
    1: [
      { id: 1, description: 'Dinner', amount: 50, date: '2024-01-01' },
      { id: 2, description: 'Movie', amount: 20, date: '2024-01-05' },
    ],
    2: [
      { id: 3, description: 'Lunch', amount: 30, date: '2024-01-02' },
      { id: 4, description: 'Uber', amount: 15, date: '2024-01-06' },
    ],
    3: [
      { id: 5, description: 'Groceries', amount: 100, date: '2024-01-03' },
      { id: 6, description: 'Gas', amount: 40, date: '2024-01-07' },
    ],
    // Add more user expenses as needed
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id']; // Get user ID from route parameters
      if (this.userId) {
        this.expenses = this.allExpenses[this.userId] || [];
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
