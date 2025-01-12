import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglemovieComponent } from './singlemovie.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

// Mock data for testing
const mockData = {
  id: '123',
  title: 'Test Movie',
  description: 'This is a test movie description.',
};


describe('SinglemovieComponent', () => {
  let component: SinglemovieComponent;
  let fixture: ComponentFixture<SinglemovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglemovieComponent, HttpClientTestingModule], // Importing standalone component
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null), // Mock paramMap with test data
              },
            },
          },
        },
        {
          provide: 'MovieService', // Mocking the service
          useValue: {
            fetchMovieDetails: jasmine.createSpy('fetchMovieDetails').and.returnValue(of(mockData)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglemovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details for ID', () => {
    // Validate the ID is fetched correctly
    expect(component.movieId).toBe('123');
  });

  it('should call fetchMovieDetails and set movie details', () => {
    expect(component.movieData).toEqual(mockData); // Check if the fetched data matches the mock data
  });
});
