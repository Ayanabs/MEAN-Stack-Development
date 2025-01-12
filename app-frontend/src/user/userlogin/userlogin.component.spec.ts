import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserloginComponent } from './userlogin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService } from '../../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('UserloginComponent', () => {
  let component: UserloginComponent;
  let fixture: ComponentFixture<UserloginComponent>;
  let sessionService: SessionService;
  let activatedRoute: ActivatedRoute;
  const mockSessionService = jasmine.createSpyObj('SessionService', ['setSession', 'getSession']);
  
  // Mock activated route to simulate query params
  const mockActivatedRoute = {
    queryParams: of({ returnUrl: '/home' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserloginComponent,HttpClientTestingModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserloginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should capture the returnUrl from query params', () => {
    component.ngOnInit();
    expect(component.returnUrl).toBe('/home');
  });

  it('should call close() and emit closeModal event', () => {
    spyOn(component.closeModal, 'emit');
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should validate username correctly', () => {
    expect(component.validateUsername('valid_username123')).toBeTrue();
    expect(component.validateUsername('invalid username')).toBeFalse();
  });

  it('should validate password correctly', () => {
    expect(component.validatePassword('validPass1')).toBeTrue();
    expect(component.validatePassword('short')).toBeFalse();
    expect(component.validatePassword('password with spaces')).toBeFalse();
  });

  it('should reset the form after successful login', () => {
    component.clientusername = 'testuser';
    component.clientpassword = 'testpassword';
    component.resetForm();
    expect(component.clientusername).toBe('');
    expect(component.clientpassword).toBe('');
  });

  it('should emit loginSuccess event after successful login', () => {
    spyOn(component.loginSuccess, 'emit');
    
    const mockResponse = { sessionId: '123', userId: '456', username: 'testuser' };
    spyOn(component['http'], 'post').and.returnValue(of(mockResponse));

    component.clientusername = 'testuser';
    component.clientpassword = 'testpassword';
    component.onSubmit();

    expect(component.loginSuccess.emit).toHaveBeenCalled();
  });

  it('should display error message on failed login', () => {
    spyOn(component['http'], 'post').and.returnValue(throwError('Error'));

    component.clientusername = 'wronguser';
    component.clientpassword = 'wrongpassword';
    component.onSubmit();

    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(By.css('.error-message')).nativeElement;
    expect(errorMessage.textContent).toBe('Login failed. Please check your username and password and try again.');
  });

  it('should navigate to the correct URL after successful login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    
    const mockResponse = { sessionId: '123', userId: '456', username: 'testuser' };
    spyOn(component['http'], 'post').and.returnValue(of(mockResponse));

    component.clientusername = 'testuser';
    component.clientpassword = 'testpassword';
    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
