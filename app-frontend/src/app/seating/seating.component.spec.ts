import { TestBed } from '@angular/core/testing';
import { SeatingComponent } from '../seating/seating.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

//import { describe, beforeEach, it } from 'node:test';
const mockData = [
  { id: 1, name: 'Movie 1' },
  { id: 2, name: 'Movie 2' },
];

const mockService = {
  fetchData: jasmine.createSpy('fetchData').and.returnValue(of(mockData)),
};

describe('SeatingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => '123' }), // Mock route parameters
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SeatingComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Check if the component is created
  });

  it(`should have the title 'app-frontend'`, () => {
    const fixture = TestBed.createComponent(SeatingComponent);
    const app = fixture.componentInstance;
  });
});
function expect(value: any) {
  return {
    toBeTruthy: () => {
      if (!value) {
        throw new Error('Expected value to be truthy, but it was falsy.');
      }
    },
    toEqual: (expected: any) => {
      if (value !== expected) {
        throw new Error(`Expected ${value} to equal ${expected}.`);
      }
    },
    toContain: (expected: string) => {
      if (typeof value !== 'string' || !value.includes(expected)) {
        throw new Error(`Expected ${value} to contain ${expected}.`);
      }
    }
  };
}

