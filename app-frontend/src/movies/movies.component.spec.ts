import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Mock HttpClient
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    mockHttpClient.get.and.returnValue(of([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]));

    // Configure TestBed
    await TestBed.configureTestingModule({
      imports: [MoviesComponent], // Import standalone component
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }, // Provide mock HttpClient
      ],
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    console.log('Mock HttpClient calls:', mockHttpClient.get.calls.all()); // Debug

    // Validate movies are fetched
    expect(component.movies).toEqual([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]);
    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:5000/api/users/getmovies');
  });
});
