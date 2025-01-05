import { Component, OnInit, AfterViewInit } from '@angular/core';

// Declare PayPal script variable (can be used in the component)
declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit, AfterViewInit {

  private isPaypalRendered: boolean = false; // Ensure PayPal is only rendered once

  constructor() { }

  ngOnInit(): void {
    // Initialization logic (not related to PayPal button rendering)
  }

  ngAfterViewInit(): void {
    if (!this.isPaypalRendered) {
      this.loadPaypalScript().then(() => {
        this.renderPaypalButton();
      });
    }
  }

  renderPaypalButton(): void {
    if (this.isPaypalRendered) return;

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '10.00' // Replace with your dynamic value
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          const payerName = details?.payer?.name?.given_name;
          alert('Transaction completed by ' + payerName);
        });
      }
    }).render('#paypal-button-container');

    this.isPaypalRendered = true;
  }

  loadPaypalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://www.paypal.com/sdk/js?client-id=AQ4dbvjCfnuvB8Q6_lFY2ptLZ96Mzetb44XH65xT8Qh5BMPzV0yHJFzVlA5zhbiT8NsH0ePwqVfHV4Ta"]')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=AQ4dbvjCfnuvB8Q6_lFY2ptLZ96Mzetb44XH65xT8Qh5BMPzV0yHJFzVlA5zhbiT8NsH0ePwqVfHV4Ta";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  }
}
