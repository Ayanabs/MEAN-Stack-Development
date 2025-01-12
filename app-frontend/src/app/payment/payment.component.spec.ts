import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaymentComponent } from './payment.component';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PaymentComponent],
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

    // Trigger change detection to call ngOnInit
    fixture.detectChanges();

    // Wait for async queryParam subscription to complete
    tick(); // Simulate passage of time for async operations

    // Trigger change detection again after the observable emits
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve totalBookedSeats from query params', fakeAsync(() => {
    tick(); // Ensure async operations complete
    fixture.detectChanges(); // Trigger change detection

    // Now, check if the value has been set correctly
    expect(component.totalBookedSeats).toBe(5); // Check if totalBookedSeats is set to 5
  }));
});
