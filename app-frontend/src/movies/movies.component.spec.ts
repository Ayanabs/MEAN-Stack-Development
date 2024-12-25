import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientTestingModule, CommonModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Triggering change detection automatically calls ngOnInit()
    console.log('Before detectChanges');
    fixture.detectChanges(); // Trigger ngOnInit and HTTP call automatically
    console.log('After detectChanges');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    const mockMovies = [{ name: 'Movie 1' }, { name: 'Movie 2' }];

    console.log('Triggering detectChanges...');
    fixture.detectChanges(); // Ensures ngOnInit and HTTP request are triggered
    console.log('DetectChanges triggered, waiting for HTTP request...');

    // Intercept the HTTP request and mock its response
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    
    // Log the HTTP request made
    console.log('HTTP request made to:', req.request.url);
    
    // Ensure the request method is GET
    expect(req.request.method).toBe('GET');
    
    // Mock backend response
    req.flush(mockMovies); // Simulate the response with mock data

    // Resolve any asynchronous operations
    tick();

    // Validate that the component's movies property has been updated correctly
    console.log('Fetched movies:', component.movies);
    expect(component.movies).toEqual(mockMovies);
  }));

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests are pending
  });
});
