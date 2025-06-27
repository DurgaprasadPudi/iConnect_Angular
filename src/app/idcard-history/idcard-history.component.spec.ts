import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardHistoryComponent } from './idcard-history.component';

describe('IdcardHistoryComponent', () => {
  let component: IdcardHistoryComponent;
  let fixture: ComponentFixture<IdcardHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcardHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
