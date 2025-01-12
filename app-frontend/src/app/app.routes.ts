import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SeatingComponent } from './seating/seating.component';
import { UserloginComponent } from '../user/userlogin/userlogin.component';
import { UsersignupComponent } from '../user/usersignup/usersignup.component';
import { NgModule } from '@angular/core';
import { SinglemovieComponent } from '../singlemovie/singlemovie.component';
import { MoviesComponent } from '../movies/movies.component';
import { AdminMovieComponent } from '../admin/admin-movie/admin-movie.component';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { AdminDashboardMovieComponent } from '../admin/admin-dashboard-movie/admin-dashboard-movie.component';
import { AuthGuard } from '../guards/auth.gaurds';
import { AdminSigninComponent } from '../admin/admin-signin/admin-signin.component';
import { AdminSignupComponent } from '../admin/admin-signup/admin-signup.component';

import { PaymentComponent } from './payment/payment.component';



export const routes: Routes = [
    { path: '', component: AdminDashboardMovieComponent}, // Default route
    { path: 'adminsignin', component: AdminSigninComponent },
    { path: 'adminsignup', component: AdminSignupComponent },
    { path: 'userlogin', component: UserloginComponent,canActivate: [AuthGuard]  },
    { path: 'usersignup', component: UsersignupComponent },
    { path: 'movies', component: MoviesComponent},
    { path: 'singlemovie/:id', component: SinglemovieComponent},
    { path: 'seating', component: SeatingComponent},
    { path: 'admin-dashboard', component: AdminDashboardComponent},
    { path: 'admin-moviedashboard', component: AdminDashboardMovieComponent},

    {path: 'payment', component: PaymentComponent}

];


