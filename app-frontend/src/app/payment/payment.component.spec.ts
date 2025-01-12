import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PaymentComponent, // Standalone component
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock route params
        },
        // Add any service mocks if needed for PaypalButtonComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;

    // Mock child component if necessary
    const paypalButtonElement = fixture.debugElement.children.find(
      el => el.componentInstance instanceof PaypalButtonComponent
    );
    if (paypalButtonElement) {
      const paypalButtonInstance = paypalButtonElement.componentInstance;
      paypalButtonInstance.someObservable = of({}); // Mock the observable
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
