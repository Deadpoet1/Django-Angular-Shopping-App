import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupSuccessDialogComponent } from './signup-success-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('SignupSuccessDialogComponent', () => {
  let component: SignupSuccessDialogComponent;
  let fixture: ComponentFixture<SignupSuccessDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SignupSuccessDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        SignupSuccessDialogComponent,
        NoopAnimationsModule,
        MatButtonModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when onClose is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
