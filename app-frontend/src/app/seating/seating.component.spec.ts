import { TestBed } from '@angular/core/testing';
import { SeatingComponent } from '../seating/seating.component';

//import { describe, beforeEach, it } from 'node:test';

describe('SeatingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatingComponent], // Use `declarations` for components
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

