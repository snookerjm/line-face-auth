// src/app/pages/verify/verify.page.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LiffService } from '../../services/liff/liff.service';
import { RegistrationService } from '../../services/registration/registration.service';
import { FaceService } from '../../services/face/face.service';
import { environment } from '../../../environments/environment';

import { IonicModule } from "@ionic/angular";
import { CardModule } from "primeng/card";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message'; // For p-message
import { ButtonModule } from 'primeng/button'; // For pButton

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  imports: [IonicModule, CardModule, FormsModule, CommonModule, MessageModule, ButtonModule],
})
export class VerifyPage implements OnInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  status = 'กำลังเตรียมระบบ...';
  accessGranted = false;

  constructor(private liff: LiffService, private reg: RegistrationService, private face: FaceService) {}

  async ngOnInit() {
    await this.liff.init();
    await this.liff.ensureLogin();
    await this.face.loadModels();
    await this.initCamera();

    const profile = await this.liff.getProfile();
    const doc = await this.reg.get(profile.userId);

    if (!doc) {
      this.status = 'ไม่พบข้อมูล กรุณาลงทะเบียนผ่าน Line OA';
      return;
    }

    const now = Date.now();
    if (now > doc.expiresAt.toDate().getTime()) {
      this.status = 'ข้อมูลหมดอายุ กรุณาลงทะเบียนใหม่';
      await this.reg.remove(profile.userId);
      return;
    }

    const descriptor = await this.face.getDescriptorFromVideo(this.videoRef.nativeElement);
    if (!descriptor) {
      this.status = 'ไม่พบใบหน้า กรุณาลองใหม่';
      return;
    }

    const dist = this.face.distance(descriptor, doc.faceDescriptor);
    if (dist <= environment.faceMatchThreshold) {
      this.status = 'ยืนยันตัวตนสำเร็จ เข้าใช้งานได้';
      this.accessGranted = true;
    } else {
      this.status = 'ไม่ผ่านการยืนยัน กรุณาลงทะเบียนใหม่';
    }
  }

  async initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = stream;
    await this.videoRef.nativeElement.play();
  }
}
