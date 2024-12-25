import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // This triggers ngOnInit and the HTTP call
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', fakeAsync(() => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];

   // More flexible URL matching
   component.fetchMovies();
    
   const req = httpMock.expectOne(request => 
     request.url.includes('/api/users/getmovies')
   );

   expect(req.request.method).toBe('GET');
   req.flush(mockMovies);

   tick();

   expect(component.movies.length).toBe(2);
   expect(component.movies).toEqual(mockMovies);
  }));





  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });
});
