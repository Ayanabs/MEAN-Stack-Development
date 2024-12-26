import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs'; // Import 'of' to return mock observable.
import { HttpClient } from '@angular/common/http';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      imports: [MoviesComponent, CommonModule],
      providers: [{ provide: HttpClient, useValue: mockHttpClient }],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', () => {
    const mockMovies = [{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }];
    mockHttpClient.get.and.returnValue(of(mockMovies)); // Mock HTTP response

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.movies).toEqual(mockMovies); // Validate the data
    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:5000/api/users/getmovies'); // Verify the API URL
  });
});
