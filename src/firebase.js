import firebase from 'firebase';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "AIzaSyCtTUIAQcEOb4_Os2FCxxeAX34ZOKrBbzE",
    authDomain: "analytics007-7d4bc.firebaseapp.com",
    databaseURL: "https://analytics007-7d4bc.firebaseio.com",
    projectId: "analytics007-7d4bc",
    storageBucket: "analytics007-7d4bc.appspot.com",
    messagingSenderId: "94676173838"
  };

/*const config = {
    apiKey: "AIzaSyDqg0j1TJPVwjEZQgTgz92vzzsrvkLgmFw",
    authDomain: "dashboard-235a6.firebaseapp.com",
    databaseURL: "https://dashboard-235a6.firebaseio.com",
    projectId: "dashboard-235a6",
    storageBucket: "dashboard-235a6.appspot.com",
    messagingSenderId: "82982572137"
};*/
  
try {
    firebase.initializeApp(config);
} catch (error) {}

export default firebase;