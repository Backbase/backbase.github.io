import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetupsComponent } from './meetups.component';

describe('EventsComponent', () => {
  let component: MeetupsComponent;
  let fixture: ComponentFixture<MeetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
