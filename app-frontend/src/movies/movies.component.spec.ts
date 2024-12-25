import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // This triggers ngOnInit and the HTTP call
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies', async() => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

    // Trigger HTTP request
    component.fetchMovies();

    // Simulate backend response
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Provide mock data for the request

    

    // Validate results
    expect(component.movies).toEqual(mockMovies);
  });
  
  it('should handle HTTP error when fetching movies', async() => {
    const errorResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };

    // Trigger ngOnInit
    fixture.detectChanges();

    // Expect the HTTP request and simulate an error
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(null, errorResponse); // Simulate an error response

    tick(); // Simulate async delay

    // Assert the movies array is empty
    expect(component.movies).toEqual([]);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });
});
