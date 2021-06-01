import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAo4pjelepLy1ZhG0GdY6-g3yLmoQzkM_8",
    authDomain: "millionreading.firebaseapp.com",
    databaseURL: "https://millionreading-default-rtdb.firebaseio.com",
    projectId: "millionreading",
    storageBucket: "millionreading.appspot.com",
    messagingSenderId: "478338125683",
    appId: "1:478338125683:web:41a137e4327452853e7f06",
    measurementId: "G-PS4JN9GCF8"
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STROAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID
})

export const auth = app.auth()
export const db = app.firestore()
export default app