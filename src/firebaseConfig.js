import Firebase from 'firebase'
let config = {
    apiKey: "AIzaSyCk2d9dzE-nALc2RHn4_dmIZmelmZEPi2U",
    authDomain: "vuejs-firebase-02-ded5b.firebaseapp.com",
    databaseURL: "https://vuejs-firebase-02-ded5b.firebaseio.com",
    projectId: "vuejs-firebase-02-ded5b",
    storageBucket: "vuejs-firebase-02-ded5b.appspot.com",
    messagingSenderId: "131882522328"
  }
const app = Firebase.initializeApp(config)
const filesRef = app.database().ref('files')

export { app, filesRef }
