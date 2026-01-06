import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AccessGuard } from './access-guard';

describe('AccessGuard', () => {
  let guard: AccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessGuard,
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } }
      ]
    });
    guard = TestBed.inject(AccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a Promise<boolean>', async () => {
    const result = await guard.canActivate();
    expect(typeof result).toBe('boolean');
  });
});
