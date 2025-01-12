import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Add this import
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute for mocking
import { PaymentComponent } from './payment.component';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [], // Declare the component, not import
      imports: [RouterTestingModule,PaymentComponent],  // Add RouterTestingModule
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { params: { id: '123' } } } // Mock ActivatedRoute
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
