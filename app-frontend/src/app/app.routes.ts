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



export const routes: Routes = [
    { path: '', component: MoviesComponent }, // Default route
    { path: 'userlogin', component: UserloginComponent },
    { path: 'usersignup', component: UsersignupComponent },
    { path: 'usersignup', component: UsersignupComponent },
    { path: 'singlemovie/:id', component: SinglemovieComponent },

];

