import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SeatingComponent } from './seating/seating.component';
import { UserloginComponent } from '../user/userlogin/userlogin.component';
import { UsersignupComponent } from '../user/usersignup/usersignup.component';
import { NgModule } from '@angular/core';



export const routes: Routes = [
    { path: '', component: HomepageComponent }, // Default route
    { path: 'userlogin', component: UserloginComponent },
    { path: 'usersignup', component: UsersignupComponent },
    { path: 'usersignup', component: UsersignupComponent },

];

