import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  
  
    beforeEach(() => {
      fixture = TestBed.createComponent(PaymentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });