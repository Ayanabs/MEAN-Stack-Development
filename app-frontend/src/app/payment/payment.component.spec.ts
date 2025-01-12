import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypalButtonComponent], // Make sure to import PayPal component
      declarations: [PaymentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ totalBookedSeats: '5' }) // Mock the query params if needed
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;

    // Set the input property directly to simulate the parent passing it
 

    // Trigger change detection to propagate the change
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass totalBookedSeats to PaypalButtonComponent', fakeAsync(() => {
    tick(); // Wait for async operations if necessary
    fixture.detectChanges(); // Trigger change detection

    // Get the PaypalButtonComponent instance
    const paypalButtonComponent = fixture.debugElement.children[0].componentInstance;

    // Check if the input value is correctly passed to the PayPal button component
    expect(paypalButtonComponent.totalBookedSeats).toBe(5);
  }));
});
