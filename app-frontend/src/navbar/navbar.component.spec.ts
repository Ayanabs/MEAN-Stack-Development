import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let httpMock: HttpTestingController;  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  
      declarations: [NavbarComponent],
    });

    component = TestBed.createComponent(NavbarComponent).componentInstance;
    httpMock = TestBed.inject(HttpTestingController);  

  it('should fetch movies', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    
    component.onSearch();  // Trigger the search method

    const req = httpMock.expectOne('http://localhost:5000/api/users/searchmovies?name=Movie');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);  // Mock the response with movie data

    httpMock.verify();  // Ensure there are no outstanding HTTP requests
  });
});
