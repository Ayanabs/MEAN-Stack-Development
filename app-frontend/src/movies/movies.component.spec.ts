import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs'; // Import 'of' to return mock observable.
import { HttpClient } from '@angular/common/http';

class MockHttpClient {
  get(url: string): Observable<any[]> {
    return of([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]); // Return mock data
  }
}

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, CommonModule],
      providers: [{ provide: HttpClient, useClass: MockHttpClient }], // Provide the mock service
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies successfully', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.movies).toEqual([{ movieName: 'Movie 1' }, { movieName: 'Movie 2' }]); // Validate the data
  });
});
