import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const liff: any;

@Injectable({ providedIn: 'root' })
export class LiffService {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    // ใส่ LIFF ID ของคุณ
    await liff.init({ liffId: environment.liffId });
    this.initialized = true;
  }

  async ensureLogin(): Promise<void> {
    if (!liff.isLoggedIn()) {
      liff.login();
      // หลัง login จะกลับมา path เดิม
    }
  }

  isLoggedIn(): boolean {
    return liff.isLoggedIn();
  }

  logout(): void {
    liff.logout();
    // หลัง logout จะกลับไปหน้าเริ่มต้นของ LIFF app
  }


  async getProfile(): Promise<{ userId: string; displayName?: string }> {
    const p = await liff.getProfile();
    return { userId: p.userId, displayName: p.displayName };
  }
}
