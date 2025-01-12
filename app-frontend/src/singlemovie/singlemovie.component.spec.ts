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
    };

    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,SinglemovieComponent  ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },  // Provide the mock ActivatedRoute
      ],
    })
    .compileComponents();


    fixture = TestBed.createComponent(SinglemovieComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details for ID', () => {
    // Mock the HTTP response
    const mockResponse = { title: 'Test Movie', id: '123', watchTime: 120 };
    component.ngOnInit();  // Trigger ngOnInit, which calls the HTTP request

    const req = httpMock.expectOne('http://localhost:5000/api/users/getmoviebyid/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);  // Return mock data

    fixture.detectChanges();  // Ensure the component updates with the new data

    // Check if movie details were set correctly
    expect(component.movieData).toEqual(mockResponse);
    expect(component.movieId).toBe('123');
  });

  it('should handle error if movie details fail to load', () => {
    component.ngOnInit();  // Trigger ngOnInit

    const req = httpMock.expectOne('http://localhost:5000/api/users/getmoviebyid/123');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));  // Simulate an error

    fixture.detectChanges();  // Ensure the component updates with the error message

    // Check if error message was set
    expect(component.errorMessage).toBe('Failed to load movie details. Please try again.');
  });

  afterEach(() => {
    httpMock.verify();  // Verify that no outstanding requests are left
  });
});
