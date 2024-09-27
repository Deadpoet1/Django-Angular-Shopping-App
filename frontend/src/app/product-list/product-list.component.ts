import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService, Product } from '../product.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule,MatToolbarModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatInputModule,RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  homeData={ 
    title:'IIHT SHOPPING APP',
  };
  products: any[] = [];
  filteredProducts: Product[] = [];
  cartQuantity: number = 0;
  private ws!: WebSocket;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
  
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
      console.log(this.products);
    },
    (error) => {
      console.error(error);
    }
  
  );
    this.updateCartQuantity();
   
    
  }

  addToCart(productId: number): void {
      this.productService.addToCart(productId);
      this.updateCartQuantity();
  }


  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.productService.logout();  // Redirect to login page after logout
  }

  updateCartQuantity() {
    this.cartQuantity = this.cartService.getTotalQuantity();
  }

  filterProducts(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (!searchTerm) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  


}
