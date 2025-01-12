import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaymentComponent } from './payment.component';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PaymentComponent], // Assuming PaymentComponent is standalone
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ totalBookedSeats: '5' }), // Mock queryParams observable
          },
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

  it('should retrieve totalBookedSeats from query params', () => {
    expect(component.totalBookedSeats).toBe(5); // Check the value is correctly parsed
  });
});
