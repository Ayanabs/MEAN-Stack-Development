import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import {  HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

       // Add a console log to check if the component is being initialized correctly
       console.log('Creating component...');
    fixture.detectChanges(); // This triggers ngOnInit and the HTTP call
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

      // Debug log to check if the fetchMovies method is being called
      console.log('Triggering detectChanges...');

    // Trigger ngOnInit (fetchMovies is called here)
    fixture.detectChanges();

    // Log to ensure ngOnInit is called and the request is made
    console.log('DetectChanges triggered, waiting for HTTP request...');

    

    // Mock HTTP request
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Simulate backend response

    // Resolve async operations
    tick();

    // Validate component data
    expect(component.movies).toEqual(mockMovies);
  }));





  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });
});
