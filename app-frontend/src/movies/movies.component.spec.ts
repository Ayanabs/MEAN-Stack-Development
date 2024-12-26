import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpTestingModule
import { of } from 'rxjs'; // Import 'of' to return mock observable.

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientModule, CommonModule, HttpClientTestingModule], // Import HttpClientTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController

    // fixture.detectChanges(); // Trigger change detection (which triggers ngOnInit and the HTTP request)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', async () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    

        // Call fetchMovies directly instead of triggering ngOnInit
        component.fetchMovies();

    // Simulate the component making the HTTP request
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET'); // Assert that the request is a GET

    // Provide the mock response
    req.flush(mockMovies); // Respond with mock data

    // Wait for asynchronous operation to complete
    await fixture.whenStable(); // Wait for async operations to finish

    // Validate that the component’s movies property was updated correctly
    expect(component.movies).toEqual(mockMovies);

    // Verify no outstanding HTTP requests remain
    httpMock.verify();
  });

  afterEach(() => {
    // Ensure that no outstanding HTTP requests are left
    httpMock.verify();
  });
});
