import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category/category.service';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response;
        console.log(this.categories);
      },
      error => {
        console.error('Error loading categories:', error);
        this.notificationService.showError('Failed to load categories. Please try again.');
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
        this.notificationService.showSuccess('Category added successfully!');
      }
    });
  }

  openEditDialog(category: any): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
      data: {
        id: category.id,
        name: category.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
        this.notificationService.showSuccess('Category updated successfully!');
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
          this.notificationService.showSuccess('Category deleted successfully!');
        },
        error => {
          console.error('Error deleting category:', error);
          this.notificationService.showError(error.error?.message || 'Failed to delete category. Please try again.');
        }
      );
    }
  }
}