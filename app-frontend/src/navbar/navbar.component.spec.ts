import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock : HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch movies',async () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
  
    // Trigger the HTTP request by calling the relevant function
    component.searchQuery = 'Movie';
    component.onSearch();
  
    // Mock HTTP request
    const req = httpMock.expectOne('http://localhost:5000/api/users/searchmovies?name=Movie 1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  
    

    // Validate results
    expect(component.filteredMovies.length).toBe(2);
    expect(component.filteredMovies).toEqual(mockMovies);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
