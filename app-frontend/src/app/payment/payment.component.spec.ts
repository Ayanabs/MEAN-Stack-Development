import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  // Mock PaypalButtonComponent to avoid errors in the test
  class MockPaypalButtonComponent {
    someObservable = of({}); // Mock observable to avoid subscription issues
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PaymentComponent, // Assuming this is a standalone component
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock ActivatedRoute
        },
        {
          provide: PaypalButtonComponent,
          useClass: MockPaypalButtonComponent, // Use the mock class
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;

    // Optional: Manually mock any additional dependencies or child component inputs
    const paypalButtonInstance = fixture.debugElement.children.find(
      el => el.componentInstance instanceof PaypalButtonComponent
    )?.componentInstance;

    if (paypalButtonInstance) {
      paypalButtonInstance.someObservable = of({}); // Ensure observable is defined
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
