import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUpdatemovieComponent } from './admin-dashboard-updatemovie.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminDashboardUpdatemovieComponent', () => {
  let component: AdminDashboardUpdatemovieComponent;
  let fixture: ComponentFixture<AdminDashboardUpdatemovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardUpdatemovieComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUpdatemovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
