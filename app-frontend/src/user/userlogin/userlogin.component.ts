import { CommonModule, NgIf } from '@angular/common';
import { HttpClient,HttpClientModule  } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './userlogin.component.html',
  standalone:true,
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {
  clientusername: string = '';
  clientpassword: string = '';
  errorMessage: string = '';
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  returnUrl: string = '/';
  constructor(private http: HttpClient, private sessionService: SessionService, private route: ActivatedRoute,private router: Router,) {}


  ngOnInit() {
    // Capture the current route from the query parameter
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
      console.log("current URL: ",this.returnUrl)
    });
  }
  // Function to close the modal
  close() {
    this.isVisible = false;
    this.closeModal.emit(); // Notify parent to update the state
  }



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
    // console.log('Login data:', loginData);

    this.http.post<{  sessionId: string; userId: string; username: string }>(
      'http://localhost:5000/api/users/login',
      loginData
    )
    .subscribe({
      next: (response) => {
        console.log('Login successful', response);

        // Store session details globally
        if (response.sessionId && response.userId && response.username) {
          const sessionData = {
            sessionId: response.sessionId,
            userId: response.userId,
            username: response.username,
            selectedMovie: '',  // Default value
            selectedTime: '',   // Default value
            selectedSeats: []   // Default value
          };
          this.sessionService.setSession(sessionData);
        } else {
          console.error('Invalid login response. Missing session data.');
        }
        console.log("Session Data:",this.sessionService.getSession())

        // Show success alert with the user's username
        alert(`Login successful! Welcome back, ${this.clientusername}.`);
        this.loginSuccess.emit(); // Emit login success event
       
        // Optionally close the modal if login is within a modal
        this.resetForm();
        this.close();
        this.router.navigateByUrl(this.returnUrl);
      },
        error: (error: any) => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please check your username and password and try again.';
        }
      });
  }

  resetForm(){
    this.clientusername = '';
   this. clientpassword = '';
  }
 
  
}
