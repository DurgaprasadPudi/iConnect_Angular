import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadInsuranceDetailsComponent } from './upload-insurance-details.component';

describe('UploadInsuranceDetailsComponent', () => {
  let component: UploadInsuranceDetailsComponent;
  let fixture: ComponentFixture<UploadInsuranceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadInsuranceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadInsuranceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
