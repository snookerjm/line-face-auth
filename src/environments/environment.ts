// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCL4UKwFD0wV6u1l6xqetHpPQ-xK2PuoNs",
    authDomain: "line-face-auth.firebaseapp.com",
    databaseURL: "https://line-face-auth-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "line-face-auth",
    storageBucket: "line-face-auth.appspot.com",
    messagingSenderId: "108300822248",
    appId: "1:108300822248:web:660901591c62a94f688b5d",
    measurementId: "G-3X3D6ZLYCX"
  },
  liffId: "2008822360-XSbdRdHm", // จาก Line Developers สำหรับ OA ของคุณ
  faceMatchThreshold: 0.6 // ปรับตามโมเดล
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
