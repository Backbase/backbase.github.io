import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetupsHeaderComponent } from './meetups-header.component';

describe('EventsHeaderComponent', () => {
  let component: MeetupsHeaderComponent;
  let fixture: ComponentFixture<MeetupsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetupsHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetupsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
