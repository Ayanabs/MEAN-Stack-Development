import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserloginComponent } from './userlogin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('UserloginComponent', () => {
  let component: UserloginComponent;
  let fixture: ComponentFixture<UserloginComponent>;
  
  const mockActivatedRoute = {
    snapshot: { paramMap: convertToParamMap({ id: '1' }) }
  };
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserloginComponent,HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
