import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ProductService } from '../product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', ['signup']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with all required fields', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.contains('firstName')).toBeTruthy();
    expect(component.signupForm.contains('lastName')).toBeTruthy();
    expect(component.signupForm.contains('username')).toBeTruthy();
    expect(component.signupForm.contains('email')).toBeTruthy();
    expect(component.signupForm.contains('phoneNumber')).toBeTruthy();
    expect(component.signupForm.contains('password')).toBeTruthy();
    expect(component.signupForm.contains('confirmPassword')).toBeTruthy();
  });

  it('should validate matching passwords', () => {
    const form = component.signupForm;
    
    // Fill in all required fields
    form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      password: 'password123',
      confirmPassword: 'password123'
    });

    // Check if the form is valid when passwords match
    expect(form.valid).toBeTruthy('Form should be valid when all fields are filled and passwords match');
    
    // Now change the confirmPassword to not match
    form.patchValue({
      confirmPassword: 'password456'
    });

    // Force the validation to run
    form.get('confirmPassword')?.updateValueAndValidity();
    
    // Log the form and control states
    console.log('Form valid:', form.valid);
    console.log('Form errors:', form.errors);
    console.log('Confirm Password errors:', form.get('confirmPassword')?.errors);

    // Check if the form is invalid when passwords don't match
    expect(form.valid).toBeFalsy('Form should be invalid when passwords do not match');
    
    // Check if the confirmPassword control has the mustMatch error
    expect(form.get('confirmPassword')?.hasError('mustMatch')).toBeTruthy('confirmPassword should have mustMatch error');
  });

  it('should call signup service on valid form submission', () => {
    const form = component.signupForm;
    form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      password: 'password123',
      confirmPassword: 'password123'
    });

    productServiceSpy.signup.and.returnValue(of({}));
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

    component.onSubmit();

    expect(productServiceSpy.signup).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
