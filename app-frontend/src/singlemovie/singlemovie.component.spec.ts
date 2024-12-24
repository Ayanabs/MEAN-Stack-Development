import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglemovieComponent } from './singlemovie.component';
import { ActivatedRoute } from '@angular/router';

describe('SinglemovieComponent', () => {
  let component: SinglemovieComponent;
  let fixture: ComponentFixture<SinglemovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglemovieComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglemovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
