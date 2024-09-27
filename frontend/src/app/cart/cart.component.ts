import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductService, Product } from '../product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: { product: Product, quantity: number }[] = [];
  isAuthenticated = false;

  constructor(private cartService: CartService, private productService: ProductService,private router:Router) { }

  ngOnInit(): void {
    this.checkAuthStatus();
    const cartItems = this.cartService.goToCart();
    

    cartItems.forEach(item => {
      this.productService.getProductById(item.productId).subscribe(product => {
        this.cart.push({ product, quantity: item.quantity });
      });
    });
  }
  checkAuthStatus(): void {
    this.productService.isAuthenticated().subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
      }

    )
  }

  incrementQuantity(item: { product: Product, quantity: number }) {
    this.cartService.incrementQuantity(item.product.id);
    item.quantity++;
  }

  decrementQuantity(item: { product: Product, quantity: number }) {
    if (item.quantity > 1) {
      this.cartService.decrementQuantity(item.product.id);
      item.quantity--;
    }
  }

  removeItem(productId: number) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.cartService.removeFromCart(productId);
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  checkout() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.cart.forEach(item => {
      const order = {
        product: item.product.id,
        quantity: item.quantity,
        order_date: new Date().toISOString().split('T')[0]  // Format the date as YYYY-MM-DD
      };
      console.log('Order Payload:', order);  // Log the payload
      this.cartService.createOrder(order).subscribe(() => {
        item.product.Quantity -= item.quantity;
        this.productService.updateProduct(item.product).subscribe();
      });
    });
    this.cartService.clearCart();
    this.cart = [];
  }

}
