import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalButtonComponent } from './paypal-button.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypalButtonComponent], // Standalone component import
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Mock 'params' Observable
            queryParams: of({ ref: 'test' }), // Add 'queryParams' if needed
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
