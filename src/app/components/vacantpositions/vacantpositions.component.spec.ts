import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantpositionsComponent } from './vacantpositions.component';

describe('VacantpositionsComponent', () => {
  let component: VacantpositionsComponent;
  let fixture: ComponentFixture<VacantpositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantpositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantpositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
