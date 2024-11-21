import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CategoryService } from 'src/app/services/category/category.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  userList: any = [];
  users = new FormControl();
  totalExpense: number = 0;
  title:string = '';
  notes: string = '';
  submitted: boolean = false;
  selectedUsers: any[] = [];
  splitType: string = 'equally';
  expenseDate: Date = new Date();
  unEqualExpense: any[] = [];
  unEqualExpenseTotal: number = 0;
  selectedCategory: any = null;
  categories: any[] = [];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchCategories();
  }



  onSubmit(): void {
    const epochDate = this.expenseDate.getTime();

    console.log('Selected Date:', this.expenseDate);
    console.log('Epoch Date:', epochDate);
    console.log('Expense Added:', {
      unEqualExpense: this.unEqualExpense,
      title: this.title,
      splitType: this.splitType,
      selectedUsers: this.selectedUsers,
      totalExpense: this.totalExpense,
      notes: this.notes,
      date: epochDate,
      categoryId: this.selectedCategory
    });

    if(this.splitType === 'equally'){
      if (this.totalExpense == null || this.totalExpense <= 0) {
        this.notificationService.showError('Please enter a valid total expense amount.');
        console.error('Total expense cannot be null or zero.');
        return;
      }

      this.expenseService.splitEqually(this.selectedUsers, this.totalExpense, this.title, this.notes, epochDate, this.splitType, this.selectedCategory).subscribe(
        (response: any) => {
          console.log('Expense split successfully:', response);
          this.notificationService.showSuccess('Expense added successfully!');
          this.closeDialog();
        },
        (error: any) => {
          console.error('Error splitting expense:', error);
          this.notificationService.showError(error.error?.message || 'Failed to add expense. Please try again.');
        }
      );
    } else {
      this.unEqualExpenseTotal = this.unEqualExpense.reduce((sum: any, item: any) => sum + Number(item.expense), 0);
      console.log('Total of individual expenses:', this.unEqualExpenseTotal);
      if (this.unEqualExpenseTotal !== this.totalExpense) {
        this.notificationService.showError('Total of individual expenses must equal the total expense.');
        return;
      }

      this.expenseService.splitUnequally(this.totalExpense, this.notes, this.unEqualExpense, this.splitType, this.selectedCategory).subscribe({
        next: (response) => {
          console.log('Expense split successfully:', response);
          this.notificationService.showSuccess('Expense added successfully!');
          this.closeDialog();
        },
        error: (error: any) => {
          console.error('Error splitting expense:', error);
          this.notificationService.showError(error.error?.message || 'Failed to add expense. Please try again.');
        }
      });
    }

    console.log(this.selectedUsers)
    this.submitted = true;
    this.resetForm();
  }

  resetForm(): void {
    this.totalExpense = 0;
    this.notes = '';
    this.submitted = false;
    this.unEqualExpense = [];
    this.unEqualExpenseTotal = 0;
    this.selectedUsers = [];
    this.users.setValue([]);
    this.expenseDate = new Date();
    this.selectedCategory = null;
  }

  fetchUsers(): void {
    this.authService.getUsers().subscribe(
      (response) => {
        this.userList = response;
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.notificationService.showError('Failed to fetch users. Please try again.');
      }
    );
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        console.log("categories", response);
        this.categories = response;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
        this.notificationService.showError('Failed to fetch categories. Please try again.');
      }
    );
  }

  selectUser(user: any): void {
    this.unEqualExpense = this.selectedUsers.map(user => ({ id: user.id, expense: 0 }));
    this.unEqualExpenseTotal += user.expense;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  closeDialog(): void {
    this.dialogRef.close('success'); // Pass 'success' back to the parent component
  }
}
