import firebase from "firebase";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCbgQ5cyKWBGhFmWQs1X0kxwXYJSkwSZ-M",
    authDomain: "vinyl-fr.firebaseapp.com",
    projectId: "vinyl-fr",
    storageBucket: "vinyl-fr.appspot.com",
    messagingSenderId: "843166347567",
    appId: "1:843166347567:web:f4a63c6dc1ae2653e3f1da",
    measurementId: "G-9MTBLLWT9J"
  };
  
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;