import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verify1Page } from './verify1.page';

describe('Verify1Page', () => {
  let component: Verify1Page;
  let fixture: ComponentFixture<Verify1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Verify1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
