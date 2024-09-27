import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login service and navigate on successful login', () => {
    const loginData = { username: 'testuser', password: 'password123' };
    component.loginForm.patchValue(loginData);
    productServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));

    component.onSubmit();

    expect(productServiceSpy.login).toHaveBeenCalledWith(loginData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should log error on login failure', () => {
    const loginData = { username: 'testuser', password: 'wrongpassword' };
    component.loginForm.patchValue(loginData);
    productServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    spyOn(console, 'error');
    component.onSubmit();

    expect(productServiceSpy.login).toHaveBeenCalledWith(loginData);
    expect(console.error).toHaveBeenCalledWith('Error logging in', jasmine.any(Error));
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not call login service if form is invalid', () => {
    component.loginForm.patchValue({ username: 'testuser' }); // Missing password
    component.onSubmit();
    expect(productServiceSpy.login).not.toHaveBeenCalled();
  });
});
