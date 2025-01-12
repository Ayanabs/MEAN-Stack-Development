import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;  // To mock HTTP requests
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Configure TestBed for the MoviesComponent
    await TestBed.configureTestingModule({
      imports: [MoviesComponent,HttpClientTestingModule, RouterTestingModule], // Import necessary modules
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies and update the movies list', () => {
    const mockMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
    
    component.ngOnInit(); // Trigger ngOnInit to initiate the HTTP request

    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies'); // Expect the API call
    expect(req.request.method).toBe('GET');  // Assert the HTTP method
    req.flush(mockMovies);  // Mock the API response with mockMovies

    httpMock.verify();  // Ensure no outstanding HTTP requests remain
    expect(component.movies).toEqual(mockMovies);  // Verify that the movies list is updated
  });

  it('should handle error while fetching movies', () => {
    const errorMessage = 'Error fetching movies';

    component.ngOnInit(); // Trigger ngOnInit to initiate the HTTP request

    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies'); // Expect the API call
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });  // Simulate an error response

    httpMock.verify();  // Ensure no outstanding HTTP requests remain
    expect(component.movies.length).toBe(0);  // Movies should remain empty on error
  });

  it('should navigate to movie details on card click', () => {
    spyOn(component['router'], 'navigate');  // Spy on the router's navigate method

    const mockMovie = { _id: '123', title: 'Movie 1' };
    component.onCardClick(mockMovie);  // Trigger the card click method

    expect(component['router'].navigate).toHaveBeenCalledWith(['/singlemovie', mockMovie._id]);  // Verify the navigation
  });

  it('should navigate to booking page on "Book Now" click', () => {
    spyOn(component['router'], 'navigate');  // Spy on the router's navigate method

    const mockMovie = { _id: '123', title: 'Movie 1' };
    component.onBookNow(mockMovie);  // Trigger the "Book Now" method

    expect(component['router'].navigate).toHaveBeenCalledWith(['/book-now', mockMovie._id]);  // Verify the navigation
  });

  afterEach(() => {
    httpMock.verify();  // Ensure no outstanding HTTP requests remain after each test
  });
});
