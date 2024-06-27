import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileThreadComponent } from './mobile-thread.component';

describe('MobileThreadComponent', () => {
  let component: MobileThreadComponent;
  let fixture: ComponentFixture<MobileThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileThreadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
