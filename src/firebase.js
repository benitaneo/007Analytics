import firebase from 'firebase';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
const config = {
    apiKey: "AIzaSyDqg0j1TJPVwjEZQgTgz92vzzsrvkLgmFw",
    authDomain: "dashboard-235a6.firebaseapp.com",
    databaseURL: "https://dashboard-235a6.firebaseio.com",
    projectId: "dashboard-235a6",
    storageBucket: "dashboard-235a6.appspot.com",
    messagingSenderId: "82982572137"
};
  
try {
    firebase.initializeApp(config);
} catch (error) {}

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export default firebase;