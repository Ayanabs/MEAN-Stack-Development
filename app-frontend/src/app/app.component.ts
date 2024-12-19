
import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

import {MoviesComponent} from '../movies/movies.component'
import { AdminMovieComponent } from '../admin/admin-movie/admin-movie.component';
import {NavbarComponent} from '../navbar/navbar.component'
import { AdminSignupComponent } from '../admin/admin-signup/admin-signup.component';
import { AdminSigninComponent } from '../admin/admin-signin/admin-signin.component';
import { UsersignupComponent } from '../user/usersignup/usersignup.component';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { AdminDashboardMovieComponent } from '../admin/admin-dashboard-movie/admin-dashboard-movie.component';




@Component({

  selector: 'app-root',

  imports: [RouterModule,NavbarComponent,MoviesComponent],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css'

})

export class AppComponent{}