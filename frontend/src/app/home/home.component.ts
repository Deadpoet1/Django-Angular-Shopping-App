import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,AuthDialogComponent,ProductListComponent,MatButtonModule,MatToolbarModule,MatIconModule,MatInputModule,FormsModule,MatDialogModule,MatFormFieldModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  homeData = {
    title: 'IIHT SHOPPING APP',
    description: 'Welcome to our shopping app!',
   
  };
  showSignInPrompt = false;
  isSignedIn = false;
  

  showAuthDialog = false;

  constructor(private router: Router) {}

  toggleAuthDialog() {
    this.showAuthDialog = !this.showAuthDialog;
  }

  onSignIn() {
    console.log('Sign In clicked');
    this.isSignedIn = true;
    
    this.showAuthDialog = false;
  }

  goToCart() {
     {
      // Navigate to the cart page
      this.router.navigate(['/cart']);
    } 
    
  }
  closeSignInPrompt() {
    this.showSignInPrompt = false;
  }
  


}
