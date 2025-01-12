import { Component } from '@angular/core';
import { PaypalButtonComponent } from "../paypal-button/paypal-button.component";

@Component({
  selector: 'app-payment',
  standalone:true,
  imports: [PaypalButtonComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
  

})
export class PaymentComponent {

}
