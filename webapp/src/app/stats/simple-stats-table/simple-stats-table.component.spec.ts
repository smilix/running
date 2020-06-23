import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleStatsTableComponent } from './simple-stats-table.component';

describe('SimpleStatsTableComponent', () => {
  let component: SimpleStatsTableComponent;
  let fixture: ComponentFixture<SimpleStatsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleStatsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleStatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
