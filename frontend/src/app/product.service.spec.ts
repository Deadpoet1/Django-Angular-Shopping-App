import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const cartSpy = jasmine.createSpyObj('CartService', ['addToCart', 'goToCart', 'clearCart']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: CartService, useValue: cartSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', price: 10, image: 'image1.jpg', Quantity: 5, description: 'Description 1', out_of_stock: 'false' },
      { id: 2, name: 'Product 2', price: 20, image: 'image2.jpg', Quantity: 3, description: 'Description 2', out_of_stock: 'false' }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/products/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should update a product', () => {
    const mockProduct: Product = { id: 1, name: 'Updated Product', price: 15, image: 'image1.jpg', Quantity: 10, description: 'Updated Description', out_of_stock: 'false' };

    service.updateProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}${mockProduct.id}/`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should get a product by id', () => {
    const mockProduct: Product = { id: 1, name: 'Product 1', price: 10, image: 'image1.jpg', Quantity: 5, description: 'Description 1', out_of_stock: 'false' };

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/products/1/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should get home data', () => {
    const mockHomeData = { featured: [], new_arrivals: [] };

    service.getHomeData().subscribe(data => {
      expect(data).toEqual(mockHomeData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/home/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHomeData);
  });

  it('should sign up a user', () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const mockResponse = { id: 1, username: 'testuser', email: 'test@example.com' };

    service.signup(mockUserData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/users/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUserData);
    req.flush(mockResponse);
  });

  it('should log in a user', () => {
    const mockCredentials = { username: 'testuser', password: 'password123' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse));
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/login/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should check if user is authenticated', (done) => {
    const mockUser = { token: 'fake-jwt-token' };
    service['currentUserSubject'].next(mockUser);

    service.isAuthenticated().subscribe(isAuth => {
      expect(isAuth).toBe(true);
      done();
    });
  });

  it('should add to cart', () => {
    service.addToCart(1);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(1);
  });

  it('should go to cart', () => {
    const mockCartItems = [{ productId: 1, quantity: 2 }];
    cartServiceSpy.goToCart.and.returnValue(mockCartItems);

    const result = service.goToCart();
    expect(result).toEqual(mockCartItems);
    expect(cartServiceSpy.goToCart).toHaveBeenCalled();
  });

  it('should clear cart', () => {
    service.clearCart();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
  });

  it('should log out user', () => {
    spyOn(service, 'getCurrentUser').and.returnValue({ token: 'fake-jwt-token' });
    service['currentUserSubject'].next({ token: 'fake-jwt-token' });
    
    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service['currentUserSubject'].value).toBeNull();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });
});
