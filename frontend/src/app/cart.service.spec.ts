import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { Order } from './order';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(1);
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 1 }]);
  });

  it('should increment quantity of existing item', () => {
    service.addToCart(1);
    service.incrementQuantity(1);
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it('should not increment quantity beyond MAX_QUANTITY', () => {
    spyOn(window, 'alert');
    
    // First, add the item to the cart
    service.addToCart(1);
    
    // Then try to increment it beyond MAX_QUANTITY
    for (let i = 0; i < 5; i++) {
      service.incrementQuantity(1);
    }
    
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 5 }]);
    expect(window.alert).toHaveBeenCalledWith('The quantity of this product is reached');
  });

  it('should decrement quantity of existing item', () => {
    service.addToCart(1);
    service.incrementQuantity(1);
    service.decrementQuantity(1);
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 1 }]);
  });

  it('should not decrement quantity below 1', () => {
    service.addToCart(1);
    service.decrementQuantity(1);
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 1 }]);
  });

  it('should remove item from cart', () => {
    service.addToCart(1);
    service.addToCart(2);
    service.removeFromCart(1);
    expect(service.goToCart()).toEqual([{ productId: 2, quantity: 1 }]);
  });

  it('should clear cart', () => {
    service.addToCart(1);
    service.addToCart(2);
    service.clearCart();
    expect(service.goToCart()).toEqual([]);
  });

  it('should get total quantity', () => {
    service.addToCart(1);
    service.addToCart(2);
    service.incrementQuantity(1);
    expect(service.getTotalQuantity()).toBe(3);
  });

  it('should create order', () => {
    const mockOrder: Order = {
      product: 1,
      quantity: 2,
      order_date: new Date().toISOString()
    };
    
    service.createOrder(mockOrder).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/orders/');
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  it('should save cart to localStorage', () => {
    service.addToCart(1);
    const storedCart = localStorage.getItem('cart');
    expect(storedCart).toBe(JSON.stringify([{ productId: 1, quantity: 1 }]));
  });

  it('should load cart from localStorage', () => {
    localStorage.setItem('cart', JSON.stringify([{ productId: 1, quantity: 2 }]));
    service['loadCart']();
    expect(service.goToCart()).toEqual([{ productId: 1, quantity: 2 }]);
  });
});
