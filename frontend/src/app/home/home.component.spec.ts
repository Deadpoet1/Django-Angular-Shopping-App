import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

// Mock components
@Component({ selector: 'app-auth-dialog', template: '' })
class MockAuthDialogComponent {}

@Component({ selector: 'app-product-list', template: '' })
class MockProductListComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        MockAuthDialogComponent,
        MockProductListComponent
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct homeData', () => {
    expect(component.homeData).toEqual({
      title: 'IIHT SHOPPING APP',
      description: 'Welcome to our shopping app!'
    });
  });

  it('should initialize with showSignInPrompt and isSignedIn as false', () => {
    expect(component.showSignInPrompt).toBeFalse();
    expect(component.isSignedIn).toBeFalse();
  });

  it('should toggle showAuthDialog when toggleAuthDialog is called', () => {
    expect(component.showAuthDialog).toBeFalse();
    component.toggleAuthDialog();
    expect(component.showAuthDialog).toBeTrue();
    component.toggleAuthDialog();
    expect(component.showAuthDialog).toBeFalse();
  });

  it('should set isSignedIn to true and hide auth dialog when onSignIn is called', () => {
    component.showAuthDialog = true;
    component.onSignIn();
    expect(component.isSignedIn).toBeTrue();
    expect(component.showAuthDialog).toBeFalse();
  });

  it('should navigate to cart when goToCart is called', () => {
    spyOn(router, 'navigate');
    component.goToCart();
    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should set showSignInPrompt to false when closeSignInPrompt is called', () => {
    component.showSignInPrompt = true;
    component.closeSignInPrompt();
    expect(component.showSignInPrompt).toBeFalse();
  });
});
