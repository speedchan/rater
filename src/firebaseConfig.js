import firebase from 'firebase';
import 'firebase/firestore';

// The core Firebase JS SDK is always required and must be listed first
// <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>

// TODO: Add SDKs for Firebase products that you want to use https://firebase.google.com/docs/web/setup#available-libraries
//<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

//Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// Firebase collections
const usersCollection = db.collection('users');
const ratingsCollection = db.collection('ratings');
const setsCollection = db.collection('sets');
const categoriesCollection = db.collection('categories');
const votesCollection = db.collection('votes');

export {
    db,
    auth,
    currentUser,
    usersCollection,
    ratingsCollection,
    setsCollection,
    categoriesCollection,
    votesCollection
}