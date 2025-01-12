import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,NavbarComponent, RouterTestingModule ],
     
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = TestBed.createComponent(NavbarComponent).componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should fetch movies', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    
    // Assuming onSearch() triggers the HTTP request for movie search
    component.onSearch();  // Trigger the search method

    const req = httpTestingController.expectOne('http://localhost:5000/api/users/searchmovies?name=Movie');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);  // Mock the response with movie data

    // Verify there are no outstanding HTTP requests
    httpTestingController.verify();

    // You can add additional expectations if necessary, like verifying the component's behavior after receiving data
    expect(component.movies).toEqual(mockMovies);  // Assuming the component has a `movies` property
  });
});
