import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {
    apiKey: "AIzaSyDJ0odWDBM0oc4Vun31gW-AoDnagj_YBmc",
    authDomain: "book-santa-38e2c.firebaseapp.com",
    projectId: "book-santa-38e2c",
    storageBucket: "book-santa-38e2c.appspot.com",
    messagingSenderId: "640410906912",
    appId: "1:640410906912:web:98d752fb387638c2faa745"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();