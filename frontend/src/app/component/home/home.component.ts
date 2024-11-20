import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environment';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddExpenseComponent } from '../add-expense/add-expense.component';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users: any = [];

  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers(); 
  }

  fetchUsers(): void {
    const apiUrl = `${environment.apiUrl}/users`; 
    this.authService.getUsers().subscribe(
      (response) => {
        this.users = response; 
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching user data:', error); 
              }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '600px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
    });
  }

}
