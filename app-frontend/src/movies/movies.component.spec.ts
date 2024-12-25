import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';  // Import 'of' to return an observable.
import { Router } from '@angular/router';  // Import Router if necessary

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;  // Mock HttpClient

  beforeEach(async () => {
    // Create a spy for the HttpClient
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientModule, CommonModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },  // Override HttpClient with our spy
        { provide: Router, useValue: {} }  // Mock Router if needed for navigation
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;

    // Mock the HTTP response for the 'get' method
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    httpClientSpy.get.and.returnValue(of(mockMovies));  // Return the mock data as an observable
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    // Triggering detectChanges to simulate ngOnInit lifecycle and HTTP request
    fixture.detectChanges();

    // Since we are using a spy, we don't need to use HttpTestingController
    // Validate that the spy's get method was called once with the expected URL
    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:5000/api/users/getmovies');
    
    // Simulate async operations
    tick();

    // Validate the component's movies property has been updated correctly
    expect(component.movies).toEqual([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]);
  }));

  afterEach(() => {
    // Nothing to verify here as we're using Jasmine spy directly
  });
});
