import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetupFooterComponent } from './meetup-footer.component';

describe('MeetupFooterComponent', () => {
  let component: MeetupFooterComponent;
  let fixture: ComponentFixture<MeetupFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetupFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetupFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
