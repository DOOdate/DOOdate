// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7dLPtksZgzNzatRTa8HLlRUqTmH-mFdU",
  authDomain: "doodate-29075.firebaseapp.com",
  projectId: "doodate-29075",
  storageBucket: "doodate-29075.firebasestorage.app",
  messagingSenderId: "419136523064",
  appId: "1:419136523064:web:db50421b85816e22634fcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Add the public key generated from the console here.
export const requestNotifications = async () => {
    getToken(messaging, { vapidKey: 'BB6a9g3EP6J73FCu0d7EWMscaXsA6eTFeEU9aaOeciWfCLxSneJRIbx1eBDfuchlfrzMBwxJdfRtCOODmy5ch3Q' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    console.log(currentToken)
  } else {
    // Show permission request UI
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
        console.log('Notification permission granted.');
        }
    })
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
}

export default app