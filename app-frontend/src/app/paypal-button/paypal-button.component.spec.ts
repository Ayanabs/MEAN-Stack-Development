import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalButtonComponent } from './paypal-button.component';
import { ActivatedRoute } from '@angular/router'; // Assuming the component uses ActivatedRoute
import { of } from 'rxjs';

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypalButtonComponent], // Import the standalone component directly here
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })  // Mock ActivatedRoute if the component uses it
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
