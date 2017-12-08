import firebase from 'firebase'
var config = {
    apiKey: <ADD>,
    authDomain: <ADD>,
    databaseURL: <ADD>,
    projectId: <ADD>,
    storageBucket: <ADD>,
    messagingSenderId:<ADD>
  };
firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

function requireAuth(){
    console.log("Inside Require Auth Function");
}

export {firebase,provider,auth};