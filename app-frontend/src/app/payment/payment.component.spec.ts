import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Observable to mock

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaypalButtonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })  // Mocking the observable for route params
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
