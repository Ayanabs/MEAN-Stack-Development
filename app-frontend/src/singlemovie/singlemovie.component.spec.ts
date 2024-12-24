import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglemovieComponent } from './singlemovie.component';

describe('SinglemovieComponent', () => {
  let component: SinglemovieComponent;
  let fixture: ComponentFixture<SinglemovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglemovieComponent]
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
