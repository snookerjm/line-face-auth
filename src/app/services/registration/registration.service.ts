import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';


export interface RegistrationDoc {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  faceDescriptor?: number[]; // เก็บเป็น array ของ number
  createdAt?: any;
  expiresAt?: any;
  status?: 'active' | 'expired';
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  constructor(private afs: AngularFirestore) {}

  private col() {
    return this.afs.collection<RegistrationDoc>('registrations');
  }

  async get(userId: string): Promise<RegistrationDoc | null> {
    const snap = await firstValueFrom(this.col().doc(userId).get());
    return snap.exists ? (snap.data() as RegistrationDoc) : null;
  }


  async set(userId: string, data: RegistrationDoc): Promise<void> {
    await this.col().doc(userId).set(data, { merge: true });
  }

  async remove(userId: string): Promise<void> {
    await this.col().doc(userId).delete();
  }
}
