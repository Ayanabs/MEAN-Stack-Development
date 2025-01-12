import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpTestingController } from '@angular/common/http/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Create a mock for HttpClient
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    mockHttpClient.get.and.returnValue(of([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]));

    // Configure TestBed
    await TestBed.overrideComponent(MoviesComponent, {
      set: {
        providers: [{ provide: HttpClient, useValue: mockHttpClient }], // Override HttpClient with the mock
      },
    })
      .configureTestingModule({
        imports: [MoviesComponent], // Import the standalone component
      })
      .compileComponents();

    // Create the component instance
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const mockMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
  
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmovies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies); // Provide mock response
  
    httpMock.verify();
  });
});
