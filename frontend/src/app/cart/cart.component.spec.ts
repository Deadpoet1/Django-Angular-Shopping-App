import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../cart.service';
import { ProductService, Product } from '../product.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CartService,
          useValue: {
            goToCart: () => [],
            createOrder: jasmine.createSpy('createOrder').and.returnValue(of({})),
            incrementQuantity: jasmine.createSpy('incrementQuantity'),
            decrementQuantity: jasmine.createSpy('decrementQuantity'),
            removeFromCart: jasmine.createSpy('removeFromCart'),
            clearCart: jasmine.createSpy('clearCart')
          }
        },
        {
          provide: ProductService,
          useValue: {
            getProductById: () => of({}),
            isAuthenticated: () => of(true),
            updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of({}))
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    fixture.detectChanges(); // This triggers ngOnInit
    expect(component.cart).toEqual([]);
  });

  it('should increment quantity', () => {
    const mockProduct = { id: 1, name: 'Test Product', price: 10, image: 'test.jpg', Quantity: 5, description: 'Test Description', out_of_stock: 'false' };
    const cartItem = { product: mockProduct, quantity: 1 };
    component.cart = [cartItem];

    component.incrementQuantity(cartItem);

    expect(cartService.incrementQuantity).toHaveBeenCalledWith(mockProduct.id);
    expect(cartItem.quantity).toBe(2);
  });

  it('should decrement quantity when quantity > 1', () => {
    const mockProduct = { id: 1, name: 'Test Product', price: 10, image: 'test.jpg', Quantity: 5, description: 'Test Description', out_of_stock: 'false' };
    const cartItem = { product: mockProduct, quantity: 2 };
    component.cart = [cartItem];

    component.decrementQuantity(cartItem);

    expect(cartService.decrementQuantity).toHaveBeenCalledWith(mockProduct.id);
    expect(cartItem.quantity).toBe(1);
  });

  it('should not decrement quantity when quantity is 1', () => {
    const mockProduct = { id: 1, name: 'Test Product', price: 10, image: 'test.jpg', Quantity: 5, description: 'Test Description', out_of_stock: 'false' };
    const cartItem = { product: mockProduct, quantity: 1 };
    component.cart = [cartItem];

    component.decrementQuantity(cartItem);

    expect(cartService.decrementQuantity).not.toHaveBeenCalled();
    expect(cartItem.quantity).toBe(1);
  });

  it('should remove item from cart', () => {
    const mockProduct1 = { id: 1, name: 'Test Product 1', price: 10, image: 'test1.jpg', Quantity: 5, description: 'Test Description 1', out_of_stock: 'false' };
    const mockProduct2 = { id: 2, name: 'Test Product 2', price: 20, image: 'test2.jpg', Quantity: 3, description: 'Test Description 2', out_of_stock: 'false' };
    component.cart = [
      { product: mockProduct1, quantity: 1 },
      { product: mockProduct2, quantity: 2 }
    ];

    component.removeItem(1);

    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
    expect(component.cart.length).toBe(1);
    expect(component.cart[0].product).toEqual(mockProduct2);
  });

  it('should navigate to login if not authenticated during checkout', () => {
    component.isAuthenticated = false;
    component.checkout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should process checkout when authenticated', fakeAsync(() => {
    component.isAuthenticated = true;
    const mockProduct1 = { id: 1, name: 'Test Product 1', price: 10, image: 'test1.jpg', Quantity: 5, description: 'Test Description 1', out_of_stock: 'false' };
    const mockProduct2 = { id: 2, name: 'Test Product 2', price: 20, image: 'test2.jpg', Quantity: 3, description: 'Test Description 2', out_of_stock: 'false' };
    component.cart = [
      { product: mockProduct1, quantity: 2 },
      { product: mockProduct2, quantity: 1 }
    ];

    component.checkout();
    tick();

    expect(cartService.createOrder).toHaveBeenCalledTimes(2);
    expect(productService.updateProduct).toHaveBeenCalledTimes(2);
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.cart).toEqual([]);
  }));

  it('should calculate total correctly', () => {
    const mockProduct1 = { id: 1, name: 'Test Product 1', price: 10, image: 'test1.jpg', Quantity: 5, description: 'Test Description 1', out_of_stock: 'false' };
    const mockProduct2 = { id: 2, name: 'Test Product 2', price: 20, image: 'test2.jpg', Quantity: 3, description: 'Test Description 2', out_of_stock: 'false' };
    component.cart = [
      { product: mockProduct1, quantity: 2 },
      { product: mockProduct2, quantity: 1 }
    ];

    const total = component.getTotal();

    expect(total).toBe(40); // (10 * 2) + (20 * 1) = 40
  });
});
