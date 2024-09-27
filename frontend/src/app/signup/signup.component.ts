import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material/dialog';
import { SignupSuccessDialogComponent } from '../signup-success-dialog/signup-success-dialog.component';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
  export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
  
    constructor(private fb: FormBuilder, private productService: ProductService, private dialog:MatDialog, private router:Router) {}
  
    ngOnInit(): void {
      this.signupForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.mustMatch('password', 'confirmPassword') });
    }
  
    mustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);
  
        if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
          return null;
        }
  
        if (control?.value !== matchingControl?.value) {
          matchingControl?.setErrors({ mustMatch: true });
        } else {
          matchingControl?.setErrors(null);
        }
  
        return null;
      };
    }
  
    onSubmit(): void {
      if (this.signupForm.valid) {
        this.productService.signup(this.signupForm.value)
          .subscribe(response => {
            console.log('User signed up successfully', response);
            const dialogRef = this.dialog.open(SignupSuccessDialogComponent);
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/login']);
            });
  
          }, error => {
            console.error('Error signing up', error);
          });
      }
    }
  }



