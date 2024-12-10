import { CommonModule, NgIf } from '@angular/common';
import { HttpClient,HttpClientModule  } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userlogin',
  imports: [FormsModule,HttpClientModule,CommonModule,NgIf],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {
  clientusername: string = '';
  clientpassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  // Function to validate username
  validateUsername(username: string): boolean {
    const usernamePattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    return usernamePattern.test(username);
  }
    // Function to validate password
    validatePassword(password: string): boolean {
      const passwordPattern = /^\S+$/; // No spaces allowed
      return passwordPattern.test(password) && password.length >= 5; // At least 5 characters
    }

  onSubmit() {

    // Reset error message on each submit
    this.errorMessage = '';

    // Validate username and password before submitting
    if (!this.validateUsername(this.clientusername)) {
      this.errorMessage = 'Username must consist of letters, numbers, and underscores only, with no spaces or special characters.';
      return;
    }

    if (!this.validatePassword(this.clientpassword)) {
      this.errorMessage = 'Password must be at least 5 characters long and cannot contain spaces.';
      return;
    }

    const loginData = {
      username: this.clientusername,
      password: this.clientpassword,
    };
    console.log('Login data:', loginData);

    this.http.post('http://localhost:5000/api/users/login', loginData)
      .subscribe({
        next: (response) => console.log('Login successful', response),
        error: (error) => console.error('Login failed', error)
      });
  }
  
}
