import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Observable to mock

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],  // Declare the component under test
      imports: [PaypalButtonComponent],  // Import the standalone component directly here
      providers: [
        {
          provide: ActivatedRoute,  // Mock the ActivatedRoute dependency
          useValue: {
            params: of({ id: '123' })  // Mocking the observable for route params
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalButtonComponent);  // Create the component instance
    component = fixture.componentInstance;  // Get the component instance
    fixture.detectChanges();  // Trigger change detection to update the view
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Test if component is created successfully
  });
});
