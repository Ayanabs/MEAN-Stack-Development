

import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient,HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-admin-movie',
  imports: [FormsModule,NgIf,CommonModule,HttpClientModule],
  standalone:true,
  templateUrl: './admin-movie.component.html',
  styleUrl: './admin-movie.component.css'
})



export class AdminMovieComponent {

  @ViewChild('movieInsertForm') movieInsertForm!: NgForm; // Access the form
  @Output() movieInserted = new EventEmitter<void>(); // Emit event after insertion
  constructor(private http: HttpClient) {}

  movie = {
    movieName: '',
    category: '',
    releaseYear: null as number | null,
    picture: null,
    additionalInfo:''
  };
  


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.movie.picture = file;
    }
  }

  onSubmit() {
    if (this.movie) {
      const insertMovieData = new FormData();
      insertMovieData.append('movieName', this.movie.movieName);
      insertMovieData.append('category', this.movie.category);
      insertMovieData.append('releaseYear', this.movie.releaseYear?.toString() ?? '');
      insertMovieData.append('additionalInfo', this.movie.additionalInfo);

      console.log('movieName', this.movie.movieName)
      console.log('category', this.movie.category)
      console.log('releaseYear', this.movie.releaseYear)
      console.log('additionalInfo', this.movie.additionalInfo)

      if (this.movie.picture) {
        insertMovieData.append('picture', this.movie.picture);
        console.log(this.movie.picture)
      } else {
        console.error('Picture is required');
        // Optionally, you can show a message to the user if the picture is missing
      }

      this.http.post('http://localhost:5000/api/users/movies', insertMovieData).subscribe(
        (response: any) => {
          console.log('Movie inserted successfully:', response);
          alert('Movie inserted successfully!');
          this.movieInserted.emit();
          this.resetForm();
        },
        (error: any) => {
          console.error('Error inserting movie:', error);
          alert('Failed to insert movie. Please try again.');
        }
      );
    }
  }

  resetForm() {
    this.movieInsertForm.resetForm(); // Reset form fields
    const fileInput = document.getElementById('picture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear file input
    }
  }
}
