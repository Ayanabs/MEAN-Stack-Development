import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

    // Mock HTTP request
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies'); // Ensure the URL matches exactly
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Return mock data

    // Validate results
    expect(component.movies).toEqual(mockMovies);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  
});
