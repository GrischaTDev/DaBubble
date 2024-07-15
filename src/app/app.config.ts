import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-f0943',
        appId: '1:199043385842:web:662b44ec62dedd082c436b',
        storageBucket: 'dabubble-f0943.appspot.com',
        apiKey: 'AIzaSyCwmM6PzC5sAJWu13TrEJEIuG2ZqDl-54A',
        authDomain: 'dabubble-f0943.firebaseapp.com',
        messagingSenderId: '199043385842',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
  ]
};
