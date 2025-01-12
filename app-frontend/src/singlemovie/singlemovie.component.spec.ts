import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglemovieComponent } from './singlemovie.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SinglemovieComponent', () => {
  let component: SinglemovieComponent;
  let fixture: ComponentFixture<SinglemovieComponent>;
  let httpMock: HttpTestingController; 
  let activatedRouteMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'), // Return mock movie ID
        },
      },
      paramMap: of({ get: jasmine.createSpy('get').and.returnValue('123') }),  // Simulate observable paramMap
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Correct the import structure
      declarations: [SinglemovieComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },  // Provide the mock ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglemovieComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();  // Trigger change detection so ngOnInit() is called
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details for ID', () => {
    // Mock the HTTP response
    const mockResponse = { title: 'Test Movie', id: '123', watchTime: 120 };

    fixture.detectChanges();  // Trigger ngOnInit() automatically

    // Expect the HTTP request for the movie details
    const req = httpMock.expectOne('http://localhost:5000/api/users/getmoviebyid/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);  // Return mock data

    fixture.detectChanges();  // Ensure the component updates with the new data

    // Check if movie details were set correctly
    expect(component.movieData).toEqual(mockResponse);
    expect(component.movieId).toBe('123');

    // Ensure there are no outstanding HTTP requests
    httpMock.verify();
  });

  it('should handle error if movie details fail to load', () => {
    fixture.detectChanges();  // Trigger ngOnInit() automatically

    const req = httpMock.expectOne('http://localhost:5000/api/users/getmoviebyid/123');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));  // Simulate an error

    fixture.detectChanges();  // Ensure the component updates with the error message

    // Check if error message was set
    expect(component.errorMessage).toBe('Failed to load movie details. Please try again.');

    // Ensure there are no outstanding HTTP requests
    httpMock.verify();
  });

  afterEach(() => {
    // Verify there are no outstanding HTTP requests after each test
    httpMock.verify();
  });
});
