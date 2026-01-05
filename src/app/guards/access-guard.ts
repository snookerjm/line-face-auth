// src/app/guards/access.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { LiffService } from 'src/app/services/liff/liff.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
  constructor(private reg: RegistrationService, private liff: LiffService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.liff.init();
    await this.liff.ensureLogin();
    const profile = await this.liff.getProfile();
    const doc = await this.reg.get(profile.userId);

    if (!doc) {
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return false;
    }

    const now = Date.now();
    const expires = doc.expiresAt.toDate().getTime();
    if (now > expires) {
      await this.reg.remove(profile.userId);
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return false;
    }

    // มีข้อมูลและยังไม่หมดอายุ → อนุญาตให้เข้า (การยืนยันใบหน้าทำในหน้า verify)
    return true;
  }
}
