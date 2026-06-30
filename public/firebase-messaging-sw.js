// This file must be at the root of your domain (/firebase-messaging-sw.js)
// Vite serves files from /public directly at the root

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// This config must match your firebaseConfig — it is public, not secret
firebase.initializeApp({
  apiKey:            "AIzaSyDdFiib8CWYH42T8_iGk7hyoHl5YYz0BDQ",
  authDomain:        "thestagetime.firebaseapp.com",
  projectId:         "thestagetime",
  storageBucket:     "thestagetime.firebasestorage.app",
  messagingSenderId: "26732756309",
  appId:             "1:26732756309:web:d5f9ba71d688fdf2a603dc",
});

const messaging = firebase.messaging();

// Handle background push messages (when tab is closed or in background)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'The Stage Time', {
    body: body ?? '',
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-192x192.png',
  });
});
