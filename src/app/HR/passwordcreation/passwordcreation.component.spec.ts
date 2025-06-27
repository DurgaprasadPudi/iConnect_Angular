import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordcreationComponent } from './passwordcreation.component';

describe('PasswordcreationComponent', () => {
  let component: PasswordcreationComponent;
  let fixture: ComponentFixture<PasswordcreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordcreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
