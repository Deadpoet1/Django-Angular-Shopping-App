import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthDialogComponent } from './auth-dialog.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthDialogComponent', () => {
  let component: AuthDialogComponent;
  let fixture: ComponentFixture<AuthDialogComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDialogComponent, RouterTestingModule],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit signIn event and navigate to login when onSignIn is called', () => {
    spyOn(component.signIn, 'emit');
    spyOn(router, 'navigate');
    component.onSignIn();
    expect(component.signIn.emit).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should emit close event and navigate to signup when onSignUp is called', () => {
    spyOn(component.close, 'emit');
    spyOn(router, 'navigate');
    component.onSignUp();
    expect(component.close.emit).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
