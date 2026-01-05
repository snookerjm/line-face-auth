// src/app/services/face.service.ts
import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({ providedIn: 'root' })
export class FaceService {
  private modelsLoaded = false;

  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return;
    const MODEL_URL = '/assets/face-models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    this.modelsLoaded = true;
  }

  async getDescriptorFromVideo(videoEl: HTMLVideoElement): Promise<Float32Array | null> {
    const detection = await faceapi
      .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection ? detection.descriptor : null;
  }

  distance(a: Float32Array, b: number[]): number {
    // Euclidean distance
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
    return Math.sqrt(sum);
  }
}
