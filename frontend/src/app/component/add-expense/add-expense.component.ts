import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  users: User[] = [];
  selectedUser: number | null = null;
  totalExpense: number | null = null;
  notes: string = '';
  submitted: boolean = false;

  // Dummy user data
  private dummyUsers: User[] = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    // Add more users as needed
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.users = this.dummyUsers; // Set the users array to dummy user data
  }

  get selectedUserName(): string {
    const user = this.users.find((u) => u.id === this.selectedUser);
    return user ? user.name : 'Unknown User';
  }

  onSubmit(): void {
    // Handle form submission logic here
    console.log('Expense Added:', {
      user: this.selectedUserName,
      totalExpense: this.totalExpense,
      notes: this.notes,
    });

    // Set submitted to true to display submitted expense details
    this.submitted = true;

    // Optionally reset the form
    this.resetForm();
  }

  resetForm(): void {
    this.selectedUser = null;
    this.totalExpense = null;
    this.notes = '';
    this.submitted = false;
  }

  selectedUsers = [];
  selectedUserIds: number[] = [];

  onUserSelect(userId: number) {
    if (!this.selectedUserIds.includes(userId)) {
      this.selectedUserIds.push(userId);
      const selectedUser = this.users.find((user) => user.id === userId);
      if (selectedUser) {
      }
    } else {
      this.selectedUserIds = this.selectedUserIds.filter((id) => id !== userId);
      this.selectedUsers = this.selectedUsers.filter(
        (user: User) => user.id !== userId
      );
    }
  }


  goBack(): void {
    this.router.navigate(['/home']); // Navigate back to the home component
  }
}
