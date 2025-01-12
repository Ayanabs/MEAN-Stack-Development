import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // Trigger change detection
  });

  it('should fetch movies', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    
    // Call onSearch method to trigger the HTTP request
    component.onSearch();  
    fixture.detectChanges();  // Trigger change detection to ensure the request is made

    // Expect the HTTP request for the searchMovies API
    const req = httpMock.expectOne('http://localhost:5000/api/users/searchmovies?name=Movie');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);  // Mock the response with movie data

    // Ensure no outstanding HTTP requests after the test
    httpMock.verify();  
  });

  afterEach(() => {
    // Ensure there are no outstanding HTTP requests after each test
    httpMock.verify();
  });
});
