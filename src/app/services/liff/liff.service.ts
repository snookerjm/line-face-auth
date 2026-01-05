import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const liff: any;

@Injectable({
  providedIn: 'root'
})
export class LiffService {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    await liff.init({ liffId: environment.liffId });
    this.initialized = true;
  }

  async ensureLogin(): Promise<void> {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }

  async getProfile(): Promise<{ userId: string; displayName: string; pictureUrl?: string }> {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl
    };
  }
}
