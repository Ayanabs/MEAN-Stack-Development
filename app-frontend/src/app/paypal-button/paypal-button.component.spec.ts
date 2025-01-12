import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PaypalButtonComponent } from './paypal-button.component';
import { of } from 'rxjs';  // Import 'of' to mock observables

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaypalButtonComponent],
      imports: [RouterTestingModule],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: { params: { id: '456' } },  // Mock route params if needed
            queryParams: of({ amount: 100 })  // Mock query params observable if used
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
