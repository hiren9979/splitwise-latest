import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category/category.service';

interface CategoryData {
  id?: number;
  name: string;
}

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.categoryForm.patchValue({
        id: this.data.id,
        name: this.data.name
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData: CategoryData = {
        name: this.categoryForm.get('name')?.value,
        id: this.categoryForm.get('id')?.value
      };
      
      if (this.isEditMode) {
        const id = this.categoryForm.get('id')?.value;
        this.categoryService.updateCategory(id, categoryData).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error updating category:', error);
          }
        );
      } else {
        this.categoryService.createCategory(categoryData).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error creating category:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 