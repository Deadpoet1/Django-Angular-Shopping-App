import { Component,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() signIn = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClose() {
    this.close.emit();
  }

  onSignIn() {
    this.signIn.emit();
    this.router.navigate(['/login']);
  }

  onSignUp() {
    this.close.emit(); // Close the dialog
    this.router.navigate(['/signup']); // Navigate to signup page
  }
}

