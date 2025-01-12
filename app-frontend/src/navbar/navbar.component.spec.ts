import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock ActivatedRoute to simulate route behavior in tests
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('Movie'),
    },
  },
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NavbarComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },  // Provide mock ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should fetch movies', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

    // Set the search query and manually call onSearch method
    component.searchQuery = 'Movie';
    
    // Trigger the search method which makes the HTTP request
    component.onSearch(); // Calling onSearch directly in test
    fixture.detectChanges();  // Ensure change detection triggers the HTTP request

    // Expect the HTTP request for the searchMovies API
    const req = httpMock.expectOne(
      'http://localhost:5000/api/users/searchmovies?name=Movie'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Mock the response with movie data

    // Ensure that the filteredMovies are set correctly
    expect(component.filteredMovies.length).toBe(2);
    expect(component.filteredMovies[0].movieName).toBe('Movie 1');
    expect(component.filteredMovies[1].movieName).toBe('Movie 2');

    // Ensure no outstanding HTTP requests after the test
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();  // Verify that there are no pending HTTP requests
  });
});
