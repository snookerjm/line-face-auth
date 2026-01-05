// src/app/services/registration.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';

export interface Registration {
  lineUserId: string;
  displayName: string;
  contact: string;
  faceDescriptor: number[];
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  constructor(private afs: AngularFirestore) {}

  async saveTemporary(reg: Omit<Registration, 'createdAt' | 'expiresAt'>, ttlMinutes = 5): Promise<void> {
    const now = Timestamp.now();
    const expires = Timestamp.fromDate(new Date(Date.now() + ttlMinutes * 60_000));
    const docRef = this.afs.collection<Registration>('registrations').doc(reg.lineUserId);
    await docRef.set({ ...reg, createdAt: now, expiresAt: expires });
  }

  async get(lineUserId: string): Promise<Registration | null> {
    const snap = await this.afs.collection<Registration>('registrations').doc(lineUserId).ref.get();
    return snap.exists ? (snap.data() as Registration) : null;
  }

  async remove(lineUserId: string): Promise<void> {
    await this.afs.collection('registrations').doc(lineUserId).delete();
  }
}
