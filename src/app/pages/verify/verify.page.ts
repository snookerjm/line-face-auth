// src/app/pages/verify/verify.page.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LiffService } from '../../services/liff/liff.service';
import { RegistrationService } from '../../services/registration/registration.service';
import { FaceService } from '../../services/face/face.service';

import { IonicModule } from "@ionic/angular";
import { CardModule } from "primeng/card";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageModule } from  "primeng/message"; // For p-message
import { ButtonModule } from "primeng/button"; // For pButton

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  imports: [IonicModule, CardModule, FormsModule, CommonModule, MessageModule, ButtonModule],
})
export class VerifyPage {
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;

  constructor(
    private liff: LiffService,
    private reg: RegistrationService,
    private face: FaceService,
    private router: Router
  ) {}

  async ionViewDidEnter() {
    await this.initCamera();
  }

  async initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    this.videoRef.nativeElement.srcObject = stream;
    await this.videoRef.nativeElement.play();
  }

  async verifyNow() {
    const profile = await this.liff.getProfile();
    const doc = await this.reg.get(profile.userId);
    if (!doc) {
      alert('ไม่พบข้อมูล กรุณาสมัครใหม่');
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return;
    }

    const now = Date.now();
    const expires = doc.expiresAt?.toDate?.().getTime?.() ?? 0;
    if (now > expires || doc.status === 'expired') {
      await this.reg.remove(profile.userId);
      alert('ข้อมูลหมดอายุ กรุณาสมัครใหม่');
      this.router.navigateByUrl('/register', { replaceUrl: true });
      return;
    }

    const liveDescriptor = await this.face.extractDescriptor(this.videoRef.nativeElement);
    if (!liveDescriptor) {
      alert('ไม่พบใบหน้า กรุณาสแกนใหม่อีกครั้ง');
      return;
    }

    const ok = this.face.isMatch(liveDescriptor, doc.faceDescriptor ?? []);
    if (!ok) {
      alert('ใบหน้าไม่ตรง กรุณาสแกนใหม่อีกครั้ง');
      return;
    }

    // ผ่านแล้ว → เข้าระบบ (ไปหน้า home)
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
