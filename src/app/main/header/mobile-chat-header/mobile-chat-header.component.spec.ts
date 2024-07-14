import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileChatHeaderComponent } from './mobile-chat-header.component';

describe('MobileChatHeaderComponent', () => {
  let component: MobileChatHeaderComponent;
  let fixture: ComponentFixture<MobileChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileChatHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
