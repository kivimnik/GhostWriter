import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewriterComponent } from './rewriter.component';

describe('RewriterComponent', () => {
  let component: RewriterComponent;
  let fixture: ComponentFixture<RewriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
