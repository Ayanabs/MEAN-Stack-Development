
import { Component } from '@angular/core';
<<<<<<< Updated upstream

import { RouterModule } from '@angular/router';


=======
import { RouterModule } from '@angular/router';
import { UserloginComponent } from '../user/userlogin/userlogin.component';
import { UsersignupComponent } from 'D:/MEAN-Stack-Development/app-frontend/src/user/usersignup/usersignup.component';
>>>>>>> Stashed changes

@Component({

  selector: 'app-root',
<<<<<<< Updated upstream

  imports: [RouterModule],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css'

=======
  standalone: true,
  imports: [UsersignupComponent,RouterModule,],  //usersignup component was imported to the html for the route functionality
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
>>>>>>> Stashed changes
})

export class AppComponent{}