import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecordComponent } from './video-record.component';

describe('VideoRecordComponent', () => {
  let component: VideoRecordComponent;
  let fixture: ComponentFixture<VideoRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
