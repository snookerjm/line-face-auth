import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegistrationService } from '../services/registration/registration.service';
import { LiffService } from '../services/liff/liff.service';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
  constructor(private reg: RegistrationService, private liff: LiffService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // 1) บังคับให้ LINE login
    await this.liff.init();
    await this.liff.ensureLogin();

    // 2) ดึง profile
    const profile = await this.liff.getProfile(); // { userId, displayName, ... }

    // 3) โหลด registration doc
    const doc = await this.reg.get(profile.userId);

    // 4) ไม่มีข้อมูล → ไปสมัคร
    if (!doc) {
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return false;
    }

    // 5) หมดอายุ → ลบ + ไปสมัครใหม่
    const now = Date.now();
    const expires = doc.expiresAt?.toDate?.().getTime?.() ?? 0;
    if (now > expires || doc.status === 'expired') {
      await this.reg.remove(profile.userId);
      // แจ้งเตือนแบบ non-blocking (คุณจะเลือกใช้ toast/snackbar ก็ได้)
      alert('ข้อมูลหมดอายุ กรุณาสมัครใหม่');
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return false;
    }

    // 6) มีข้อมูลและยังไม่หมดอายุ → ไปหน้า verify เพื่อสแกนใบหน้า
    this.router.navigateByUrl('/verify', { replaceUrl: true });
    return false; // guard route นี้ไม่ต้องเข้าหน้า home ตรง ให้ไป verify ก่อน
  }
}
