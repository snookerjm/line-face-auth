// src/app/pages/register/register.page.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LiffService } from '../../services/liff/liff.service';
import { FaceService } from '../../services/face/face.service';
import { RegistrationService } from '../../services/registration/registration.service';

import { IonicModule } from "@ionic/angular";
import { CardModule } from "primeng/card";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, CardModule, FormsModule, CommonModule],
})
export class RegisterPage {
  firstName = '';
  lastName = '';
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

  async submit() {
    const profile = await this.liff.getProfile();
    const descriptor = await this.face.extractDescriptor(this.videoRef.nativeElement);
    if (!descriptor) {
      alert('ไม่พบใบหน้า กรุณาลองใหม่');
      return;
    }

    const expiresMs = 24 * 60 * 60 * 1000; // กำหนดหมดอายุ 1 วัน (ปรับได้)
    const now = new Date();
    const expires = new Date(now.getTime() + expiresMs);

    await this.reg.set(profile.userId, {
      displayName: profile.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      faceDescriptor: descriptor,
      createdAt: now,
      expiresAt: expires,
      status: 'active'
    });

    alert('สมัครสำเร็จ');
    this.router.navigateByUrl('/verify', { replaceUrl: true });
  }
}
