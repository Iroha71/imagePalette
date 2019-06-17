import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCYs3-qo56-xr_osJDD2ojevs4LEspzLkE",
    authDomain: "imagepalette-bb564.firebaseapp.com",
    databaseURL: "https://imagepalette-bb564.firebaseio.com",
    projectId: "imagepalette-bb564",
    storageBucket: "imagepalette-bb564.appspot.com",
    messagingSenderId: "659280297990",
    appId: "1:659280297990:web:2826f645780e534c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase