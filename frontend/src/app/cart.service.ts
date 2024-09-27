import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order';
import { Product } from './product.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/orders/';
  private cart: { productId: number, quantity: number }[] = [];
  private readonly MAX_QUANTITY = 5;
  private products: Product[] = [];
  
  constructor(private http: HttpClient) {
    this.loadCart();
    
  }


  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch (e) {
      return false;
    }
  }

  private saveCart(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  private loadCart(): void {
    if (this.isLocalStorageAvailable()) {
      const cart = localStorage.getItem('cart');
      if (cart) {
        this.cart = JSON.parse(cart);
      }
    }
  }
  private getAvailableQuantity(productId: number): number {
    const product = this.products.find(p => p.id === productId);
    return product ? product.Quantity : 0;
  }

  addToCart(productId: number): void {
    const item = this.cart.find(p => p.productId === productId);
    const availableQuantity = this.getAvailableQuantity(productId);
    if (item) {
      if (item.quantity< this.MAX_QUANTITY) {
        item.quantity++;
      } else {
        alert('The quantity of this product is reached');
      }
    } else {
      this.cart.push({ productId, quantity: 1 });
    }
    this.saveCart();
  }

  incrementQuantity(productId: number): void {
    const item = this.cart.find(p => p.productId === productId);
    if (item && item.quantity < this.MAX_QUANTITY) {
      item.quantity++;
      this.saveCart();
    } else if (item) {
      alert('The quantity of this product is reached');
    }
  }

  decrementQuantity(productId: number): void {
    const item = this.cart.find(p => p.productId === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.saveCart();
    }
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.saveCart();
  }

  goToCart(): { productId: number, quantity: number }[] {
    {
      return this.cart;

    }
    
    
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
  }

  getTotalQuantity(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }
}