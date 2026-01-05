// src/app/pages/register/register.page.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class RegisterPage implements OnInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  displayName = '';
  contact = '';
  loading = false;
  message = '';

  constructor(private liff: LiffService, private face: FaceService, private reg: RegistrationService) {}

  async ngOnInit() {
    await this.liff.init();
    await this.liff.ensureLogin();
    const profile = await this.liff.getProfile();
    this.displayName = profile.displayName;

    await this.face.loadModels();
    await this.initCamera();
  }

  async initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = stream;
    await this.videoRef.nativeElement.play();
  }

  async onSubmit() {
    this.loading = true;
    try {
      const descriptor = await this.face.getDescriptorFromVideo(this.videoRef.nativeElement);
      if (!descriptor) {
        this.message = 'ไม่พบใบหน้า กรุณาลองใหม่';
        this.loading = false;
        return;
      }

      const profile = await this.liff.getProfile();
      await this.reg.saveTemporary({
        lineUserId: profile.userId,
        displayName: this.displayName,
        contact: this.contact,
        faceDescriptor: Array.from(descriptor)
      });

      this.message = 'ลงทะเบียนสำเร็จ (อายุข้อมูล 5 นาที)';
    } catch (e) {
      this.message = 'เกิดข้อผิดพลาดในการลงทะเบียน';
    } finally {
      this.loading = false;
    }
  }
}
