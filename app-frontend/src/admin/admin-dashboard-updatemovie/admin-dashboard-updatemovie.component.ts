import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-updatemovie',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-dashboard-updatemovie.component.html',
  styleUrl: './admin-dashboard-updatemovie.component.css'
})
export class AdminDashboardUpdatemovieComponent {

  currentYear = new Date().getFullYear(); // Max year for releaseYear validation
  @Input() movie: any = [];
  @Output() close = new EventEmitter<void>(); // Emit event to close the form

  @Input() movieId!: string;
  private getMovieUrl = 'http://localhost:5000/api/users/getmoviebyid'; // Backend URL to fetch a movie
  private updateMovieUrl = 'http://localhost:5000/api/users/updatemovie'; // Backend URL to update a movie

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMovieDetails();
  }

 // Fetch the existing movie details by ID
 fetchMovieDetails() {
  console.log('Fetching movie details for ID:', this.movieId);
  this.http.get<any>(`${this.getMovieUrl}/${this.movieId}`).subscribe({
    next: (data) => {
      this.movie = { ...data}; 
      console.log('Fetched movie data:', JSON.stringify(this.movie, null, 2));
    },
    error: (err) => {
      console.error('Error fetching movie details:', err);
    },
  });
}

  // Handle file input for the movie picture
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.movie.pictureFile = file;
      this.movie.picturePreview = URL.createObjectURL(file);
      this.movie.picture = input.files[0];
      console.log('Selected file:', file);
    }
  }

  // Submit updated movie data to the backend
  onSubmit() {
    const formData = new FormData();
    formData.append('movieName', this.movie.movieName);
    formData.append('category', this.movie.category);
    formData.append('releaseYear', this.movie.releaseYear);
    formData.append('additionalInfo', this.movie.additionalInfo || '');
    if (this.movie.picture) {
      formData.append('picture', this.movie.picture);
    }
    console.log('Update movie ID:',this.movieId)
    console.log(formData)

    // Send the updated data to the backend
    this.http.put(`${this.updateMovieUrl}/${this.movieId}`, formData).subscribe({
      next: () => {
        console.log('Movie updated successfully!');
        alert('Movie updated successfully.');
        this.close.emit();
      //   this.router.navigate(['/dashboard']); // Navigate back to the dashboard
      },
      error: (err) => {
        console.error('Error updating movie:', err);
      },
    });
  }

}