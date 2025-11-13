importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD7dLPtksZgzNzatRTa8HLlRUqTmH-mFdU",
  authDomain: "doodate-29075.firebaseapp.com",
  projectId: "doodate-29075",
  storageBucket: "doodate-29075.firebasestorage.app",
  messagingSenderId: "419136523064",
  appId: "1:419136523064:web:db50421b85816e22634fcd"
};

// Initialize Firebase app instance for the service worker
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './public/vite.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});