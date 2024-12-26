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
    // Create a mock for HttpClient
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    mockHttpClient.get.and.returnValue(of([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }])); // Immediate mock setup

    await TestBed.configureTestingModule({
      imports: [MoviesComponent,CommonModule], 
      providers: [{ provide: HttpClient, useValue: mockHttpClient }], // Provide the mock HttpClient
    }).compileComponents();

    // Create the component instance
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.movies).toEqual([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]); // Validate fetched movies
    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:5000/api/users/getmovies'); // Validate API call
  });
});
