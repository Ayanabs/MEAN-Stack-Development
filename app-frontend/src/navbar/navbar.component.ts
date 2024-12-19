import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule,NgIf,NgFor],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery: string = '';
  movies: any[] = [];
  filteredMovies: any[] = []; 
  errorMessage: string = '';
  private searchMoviesUrl = 'http://localhost:5000/api/users/searchmovies'; 

  constructor(private http: HttpClient, private router: Router) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.http
        .get<any[]>(`${this.searchMoviesUrl}`, { params: { name: this.searchQuery } })
        .subscribe({
          next: (response) => {
            this.filteredMovies = response
              .filter((movie) =>
                movie.movieName.toLowerCase().startsWith(this.searchQuery.toLowerCase())
              )
              .concat(
                response.filter(
                  (movie) =>
                    !movie.movieName.toLowerCase().startsWith(this.searchQuery.toLowerCase())
                )
              );
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
          }
        });
    } else {
      this.filteredMovies = []; 
      this.errorMessage = 'Please enter a movie name to search.';
    }
  }
  onMovieClick(movie: any) {
    console.log('Selected movie:', movie);
    // Navigate to a details page or perform another action
  }
}
