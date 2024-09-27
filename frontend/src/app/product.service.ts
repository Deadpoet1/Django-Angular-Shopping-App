import { Injectable,Inject,PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map ,tap} from 'rxjs/operators';
import { CartService } from './cart.service';
import { isPlatformBrowser } from '@angular/common';

import { Router } from '@angular/router';




export interface Product{
  id: number;
  name: string;
  price: number;
  image: string;
  Quantity: number;
  description: string;
  out_of_stock: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/';
  private currentUserSubject: BehaviorSubject<any>;
  public curentUser: Observable<any>;
  private isBrowser: boolean;
 

  constructor(private http: HttpClient ,private cartService: CartService,@Inject(PLATFORM_ID)platformId:Object, private router:Router) { 
    this.isBrowser=isPlatformBrowser(platformId);
    this.currentUserSubject= new BehaviorSubject<any>(this.getCurrentUser());
    this.curentUser=this.currentUserSubject.asObservable();

  }
public getCurrentUser(): any {
  if (this.isBrowser) {
    
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    
  }
  return {};
}
private setCurrentUser(user: any): void {
  if (this.isBrowser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  this.currentUserSubject.next(user);
}


  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products/`);
    
  }
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${product.id}/`, product);
  }
 
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/api/products/${productId}/`);
  }
  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/home/`);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users/`, userData);
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login/`, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })

    );
  }

  isAuthenticated(): Observable <boolean> {
    return this.curentUser.pipe(
      map(user => !!user && !!user.token)
      
    );
    
  }

  // Cart methods

  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }
  goToCart(): { productId: Number, quantity: number }[] {
    return this.cartService.goToCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      
      
    }
    
    this.currentUserSubject.next(null);
    console.log('logout');
    this.cartService.clearCart();
    this.router.navigate(['']);
  }
  
}