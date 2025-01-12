import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglemovieComponent } from './singlemovie.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('SinglemovieComponent', () => {
  let component: SinglemovieComponent;
  let fixture: ComponentFixture<SinglemovieComponent>;
  let activatedRoute: ActivatedRoute;
  
  const mockActivatedRoute = {
    paramMap: of({ get: (param: string) => '123' })  // Mock route parameter 'id' = '123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule,SinglemovieComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SinglemovieComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details when route parameter "id" changes', () => {
    const movieDetails = { watchTime: 120 }; // Mocked movie data
    spyOn(component['http'], 'get').and.returnValue(of(movieDetails));

    component.ngOnInit(); // Trigger ngOnInit

    expect(component.movieId).toBe('123');
    expect(component.movieData).toEqual(movieDetails);
    expect(component['http'].get).toHaveBeenCalledWith('http://localhost:5000/api/users/getmoviebyid/123');
  });

  it('should handle error when fetching movie details fails', () => {
    spyOn(component['http'], 'get').and.returnValue(throwError('Error'));

    component.ngOnInit(); // Trigger ngOnInit

    expect(component.errorMessage).toBe('Failed to load movie details. Please try again.');
  });

  it('should convert watch time correctly', () => {
    component.movieData = { watchTime: 130 };  // 2 hours 10 minutes
    fixture.detectChanges();

    const watchTime = component.watchTimeConverted;
    expect(watchTime).toBe('2 hours 10 minutes');
  });

  it('should display error message when there is a failure', () => {
    component.errorMessage = 'Failed to load movie details. Please try again.';
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.nativeElement.textContent).toBe('Failed to load movie details. Please try again.');
  });
});
