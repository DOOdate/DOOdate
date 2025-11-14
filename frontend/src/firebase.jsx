import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";


const firebaseConfig = {
  apiKey: "AIzaSyD7dLPtksZgzNzatRTa8HLlRUqTmH-mFdU",
  authDomain: "doodate-29075.firebaseapp.com",
  projectId: "doodate-29075",
  storageBucket: "doodate-29075.firebasestorage.app",
  messagingSenderId: "419136523064",
  appId: "1:419136523064:web:db50421b85816e22634fcd"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


export const requestNotifications = async () => {
    getToken(messaging, { vapidKey: 'BB6a9g3EP6J73FCu0d7EWMscaXsA6eTFeEU9aaOeciWfCLxSneJRIbx1eBDfuchlfrzMBwxJdfRtCOODmy5ch3Q' }).then((currentToken) => {
  if (currentToken) {
    console.log(currentToken)
    axios.post('/api/savetoken/', { token: currentToken })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
  } else {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
        console.log('Notification permission granted.');
        }
    })
    console.log('No registration token available. Request permission to generate one.');
  }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
}

export default app