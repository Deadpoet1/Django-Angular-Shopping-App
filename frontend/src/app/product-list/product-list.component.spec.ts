import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../product.service'; // Adjust the import path as needed
import { Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'addToCart', 'logout']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getTotalQuantity']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'cart', component: ProductListComponent }
        ]),
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ProductListComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService.getProducts.and.returnValue(of([]));
    cartService.getTotalQuantity.and.returnValue(0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', price: 10, image: 'image1.jpg', Quantity: 5, description: 'Description 1', out_of_stock: 'false' },
      { id: 2, name: 'Product 2', price: 20, image: 'image2.jpg', Quantity: 3, description: 'Description 2', out_of_stock: 'false' }
    ];
    productService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
    expect(productService.getProducts).toHaveBeenCalled();
  }));

  it('should navigate to cart when goToCart is called', fakeAsync(() => {
    component.goToCart();
    tick();
    expect(location.path()).toBe('/cart');
  }));

  describe('filterProducts', () => {
    beforeEach(() => {
      component.products = [
        { id: 1, name: 'Apple', price: 1, image: 'apple.jpg', Quantity: 10, description: 'Fresh apple', out_of_stock: 'false' },
        { id: 2, name: 'Banana', price: 2, image: 'banana.jpg', Quantity: 15, description: 'Yellow banana', out_of_stock: 'false' },
        { id: 3, name: 'Cherry', price: 3, image: 'cherry.jpg', Quantity: 0, description: 'Red cherry', out_of_stock: 'true' }
      ];
      component.filteredProducts = [...component.products];
      fixture.detectChanges();
    });

    it('should filter products based on search term', fakeAsync(() => {
      const event = { target: { value: 'an' } } as any;
      component.filterProducts(event);
      tick();
      fixture.detectChanges();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Banana');
    }));

    it('should show all products when search term is empty', fakeAsync(() => {
      const event = { target: { value: '' } } as any;
      component.filterProducts(event);
      tick();
      fixture.detectChanges();
      expect(component.filteredProducts.length).toBe(3);
    }));

    it('should be case insensitive', fakeAsync(() => {
      const event = { target: { value: 'CHERRY' } } as any;
      component.filterProducts(event);
      tick();
      fixture.detectChanges();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Cherry');
    }));

   

    it('should handle out of stock products', fakeAsync(() => {
      const event = { target: { value: 'cherry' } } as any;
      component.filterProducts(event);
      tick();
      fixture.detectChanges();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].out_of_stock).toBe('true');
    }));
  });
  


});
