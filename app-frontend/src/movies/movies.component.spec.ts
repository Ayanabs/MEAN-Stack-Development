import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule
      declarations: [MoviesComponent], // Declare the component
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

    // Trigger ngOnInit (fetchMovies is called here)
    fixture.detectChanges();

    // Mock HTTP request
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Simulate backend response

    // Resolve async operations
    tick();

    // Validate component data
    expect(component.movies).toEqual(mockMovies);
  }));

  it('should handle HTTP error', fakeAsync(() => {
    // Trigger ngOnInit
    fixture.detectChanges();

    // Simulate backend error
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    // Resolve async operations
    tick();

    // Validate component state after error
    expect(component.movies).toEqual([]); // Assuming movies remains empty on error
  }));

  afterEach(() => {
    // Ensure no outstanding HTTP requests
    httpMock.verify();
  });
});
