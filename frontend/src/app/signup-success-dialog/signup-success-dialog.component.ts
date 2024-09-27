import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-success-dialog',
  standalone: true,
  imports: [],
  templateUrl: './signup-success-dialog.component.html',
  styleUrl: './signup-success-dialog.component.css'
})
export class SignupSuccessDialogComponent {
  constructor( public dialogRef: MatDialogRef<SignupSuccessDialogComponent>,
    private router: Router
   ){}
  close(): void {
    this.dialogRef.close();
    this.router.navigate(['login/']);
  }

}
