import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

    fixture.detectChanges(); // Trigger change detection (which triggers ngOnInit and the HTTP request)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

    // Trigger change detection to simulate ngOnInit lifecycle and HTTP request
    fixture.detectChanges();

    // Now, we are intercepting the HTTP request made by the component
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET'); // Assert that the request is a GET

    // Provide the mock response
    req.flush(mockMovies); // Respond with mock data

    // Resolve async operations (simulate passage of time)
    tick();

    // Validate that the component’s movies property was updated correctly
    expect(component.movies).toEqual(mockMovies);

    // Verify no outstanding HTTP requests remain
    httpMock.verify();
  }));

  afterEach(() => {
    // Ensure that no outstanding HTTP requests are left
    httpMock.verify();
  });
});
