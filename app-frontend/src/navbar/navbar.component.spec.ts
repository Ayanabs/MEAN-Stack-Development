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

  it('should fetch movies and set filteredMovies correctly', () => {
    // Mock data directly
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    
    // Set search query to simulate the user entering a query
    component.searchQuery = 'Movie';
    
    // Mock the HTTP call inside the onSearch method
    spyOn(component['http'], 'get').and.returnValue(of(mockMovies));

    // Trigger the search method
    component.onSearch();
    fixture.detectChanges();  // Ensure change detection triggers the HTTP request

    // Verify filteredMovies are updated correctly
    expect(component.filteredMovies.length).toBe(2);
    expect(component.filteredMovies[0].movieName).toBe('Movie 1');
    expect(component.filteredMovies[1].movieName).toBe('Movie 2');
  });

  afterEach(() => {
    httpMock.verify();  // Verify that there are no pending HTTP requests
  });
});