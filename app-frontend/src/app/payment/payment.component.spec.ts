import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaymentComponent } from './payment.component';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';

// Create a mock for the PaypalButtonComponent
class MockPaypalButtonComponent {
  someObservable = of({}); // Mock observable to avoid subscription issues
}

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PaymentComponent, // Ensure PaymentComponent is standalone
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock ActivatedRoute
        },
        // Mock PaypalButtonComponent if needed
        {
          provide: PaypalButtonComponent,
          useClass: MockPaypalButtonComponent,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
