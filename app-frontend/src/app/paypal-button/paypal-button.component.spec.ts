import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';  // Import RouterTestingModule
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute for mocking
import { PaypalButtonComponent } from './paypal-button.component';

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],  // Declare the component
      imports: [RouterTestingModule,PaypalButtonComponent],  // Add RouterTestingModule if using routing
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { params: { id: '456' } } }  // Mock ActivatedRoute with an id
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaypalButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
