import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

// โหลดโมเดลครั้งเดียว
let modelsLoaded = false;

@Injectable({ providedIn: 'root' })
export class FaceService {
  async loadModels(): Promise<void> {
    if (modelsLoaded) return;
    // ใส่ path โมเดลที่คุณวาง (เช่นใน assets/models)
    const MODEL_URL = '/assets/models';
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  }

  // คืน descriptor (Float32Array → แปลงเป็น number[])
  async extractDescriptor(videoOrCanvas: HTMLVideoElement | HTMLCanvasElement): Promise<number[] | null> {
    await this.loadModels();
    const result = await faceapi
      .detectSingleFace(videoOrCanvas, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) return null;
    return Array.from(result.descriptor);
  }

  // เปรียบเทียบ descriptor ด้วย euclidean distance
  isMatch(a: number[], b: number[], threshold = 0.6): boolean {
    if (!a?.length || !b?.length || a.length !== b.length) return false;
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const d = a[i] - b[i];
      sum += d * d;
    }
    const distance = Math.sqrt(sum);
    return distance < threshold;
  }
}
