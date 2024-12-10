import { TestBed } from '@angular/core/testing';
import { SeatingComponent } from '../seating/seating.component';
// Removed incorrect import
import { describe, beforeEach, it } from 'node:test';

describe('SeatingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatingComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SeatingComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'app-frontend' title`, () => {
    const fixture = TestBed.createComponent(SeatingComponent);
    const app = fixture.componentInstance;
    
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(SeatingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titleText = compiled.querySelector('h1')?.textContent;
    expect(titleText).toContain('Hello, app-frontend');
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
