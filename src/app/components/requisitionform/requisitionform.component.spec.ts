import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionformComponent } from './requisitionform.component';

describe('RequisitionformComponent', () => {
  let component: RequisitionformComponent;
  let fixture: ComponentFixture<RequisitionformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisitionformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
