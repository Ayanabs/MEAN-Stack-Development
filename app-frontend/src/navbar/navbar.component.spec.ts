import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing'; // Mock router
import { SessionService } from '../services/session.service'; // SessionService import

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpTestingController: HttpTestingController;
  let sessionServiceMock: jasmine.SpyObj<SessionService>;

  beforeEach(() => {
    // Create a mock for SessionService
    sessionServiceMock = jasmine.createSpyObj('SessionService', ['getSession', 'clearSession']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule], // Import the necessary modules
      providers: [
        { provide: SessionService, useValue: sessionServiceMock }, // Mock the SessionService
      ],
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock session state (simulating logged-in user)
    sessionServiceMock.getSession.and.returnValue({ sessionId: 'mockSessionId' });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies on search and update filteredMovies list', () => {
    // Mock search query
    component.searchQuery = 'Movie';

    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    component.onSearch(); // Trigger the search method

    const req = httpTestingController.expectOne(
      'http://localhost:5000/api/users/searchmovies?name=Movie'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Provide mock response

    httpTestingController.verify(); // Verify no outstanding HTTP requests
    expect(component.filteredMovies.length).toBe(2); // Assert that filteredMovies has two movies
    expect(component.showDropdown).toBeTrue(); // Ensure the dropdown is visible
  });

  it('should hide dropdown if search query is empty', () => {
    component.searchQuery = ''; // Set empty query
    component.onSearch(); // Trigger the search method

    expect(component.filteredMovies.length).toBe(0); // Ensure filteredMovies is empty
    expect(component.showDropdown).toBeFalse(); // Ensure dropdown is hidden
  });

  it('should handle error on movie search', () => {
    component.searchQuery = 'Movie';
    component.onSearch(); // Trigger the search method

    const req = httpTestingController.expectOne(
      'http://localhost:5000/api/users/searchmovies?name=Movie'
    );
    req.flush('Error fetching movies', { status: 500, statusText: 'Server Error' }); // Simulate error

    httpTestingController.verify(); // Ensure no outstanding HTTP requests
    expect(component.filteredMovies.length).toBe(0); // Ensure filteredMovies is empty on error
    expect(component.showDropdown).toBeFalse(); // Ensure dropdown is hidden
  });

  it('should handle login/logout logic based on session', () => {
    // Simulate a logged-in user
    sessionServiceMock.getSession.and.returnValue({ sessionId: 'mockSessionId' });
    component.ngOnInit(); // Call ngOnInit to check session

    expect(component.isLoggedIn).toBeTrue(); // Ensure isLoggedIn is true

    // Now simulate logout
    component.logout(); // Call logout method

    // Expect sessionService.clearSession to be called after logout
    expect(sessionServiceMock.clearSession).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse(); // Ensure user is logged out
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests remain after each test
  });
});
