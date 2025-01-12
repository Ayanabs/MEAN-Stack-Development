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
          useValue: { params: of({ id: '123' }) }, // Mock params
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
