import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SeatingComponent } from './seating/seating.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },    // Default route
  { path: 'seating', component: SeatingComponent } // Route for seating
];
